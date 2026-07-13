import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from './entities/user-progress.entity';
import { StudySession, StudyMode } from './entities/study-session.entity';
import { ReviewCardDto, ReviewQuality } from './dto';
import { Card } from '../study-sets/entities/card.entity';

const INITIAL_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private readonly progressRepository: Repository<UserProgress>,
    @InjectRepository(StudySession)
    private readonly sessionRepository: Repository<StudySession>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async createSession(
    userId: string,
    studySetId?: string,
    mode: StudyMode = StudyMode.FLASHCARD,
  ): Promise<StudySession> {
    const session = this.sessionRepository.create({
      userId,
      studySetId,
      mode,
      startedAt: new Date(),
    });
    return this.sessionRepository.save(session);
  }

  async endSession(
    sessionId: string,
    userId: string,
    data: {
      cardsStudied: number;
      correctCount: number;
      timeSpentSeconds: number;
      mistakes: number;
      score?: number;
    },
  ): Promise<StudySession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Study session not found');
    }

    session.cardsStudied = data.cardsStudied;
    session.correctCount = data.correctCount;
    session.timeSpentSeconds = data.timeSpentSeconds;
    session.mistakes = data.mistakes;
    session.score = data.score;
    session.endedAt = new Date();

    return this.sessionRepository.save(session);
  }

  async reviewCard(userId: string, dto: ReviewCardDto): Promise<UserProgress> {
    const card = await this.cardRepository.findOne({
      where: { id: dto.cardId },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    let progress = await this.progressRepository.findOne({
      where: { userId, cardId: dto.cardId },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        userId,
        cardId: dto.cardId,
        easeFactor: INITIAL_EASE_FACTOR,
        intervalDays: 0,
        repetitions: 0,
        memoryScore: 0,
      });
    }

    const { easeFactor, intervalDays, repetitions } = progress;
    let newEaseFactor = easeFactor;
    let newIntervalDays = intervalDays;
    let newRepetitions = repetitions;

    const quality = dto.quality;

    if (quality < ReviewQuality.GOOD) {
      newRepetitions = 0;
      newIntervalDays = 1;
    } else {
      if (newRepetitions === 0) {
        newIntervalDays = 1;
      } else if (newRepetitions === 1) {
        newIntervalDays = 6;
      } else {
        newIntervalDays = Math.round(newIntervalDays * newEaseFactor);
      }
      newRepetitions += 1;
    }

    newEaseFactor =
      newEaseFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
    if (newEaseFactor < MINIMUM_EASE_FACTOR) {
      newEaseFactor = MINIMUM_EASE_FACTOR;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newIntervalDays);

    progress.easeFactor = Number(newEaseFactor);
    progress.intervalDays = newIntervalDays;
    progress.repetitions = newRepetitions;
    progress.nextReviewAt = nextReview;
    progress.lastReviewedAt = new Date();
    progress.reviewedAt = new Date();
    progress.studySessionId = dto.studySessionId;

    const memoryScore = quality >= ReviewQuality.GOOD ? 100 : 50;
    progress.memoryScore = memoryScore;

    return this.progressRepository.save(progress);
  }

  async getCardProgress(userId: string, cardId: string): Promise<UserProgress | null> {
    return this.progressRepository.findOne({
      where: { userId, cardId },
    });
  }

  async getDueCards(userId: string, studySetId?: string, limit = 50): Promise<UserProgress[]> {
    const queryBuilder = this.progressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.card', 'card')
      .where('progress.userId = :userId', { userId })
      .andWhere('progress.nextReviewAt IS NULL OR progress.nextReviewAt <= :now', {
        now: new Date(),
      });

    if (studySetId) {
      queryBuilder.andWhere('card.studySetId = :studySetId', { studySetId });
    }

    return queryBuilder
      .orderBy('progress.nextReviewAt', 'ASC', 'NULLS FIRST')
      .addOrderBy('progress.repetitions', 'ASC')
      .limit(limit)
      .getMany();
  }

  async getStudySetProgress(userId: string, studySetId: string): Promise<{
    totalCards: number;
    masteredCards: number;
    learningCards: number;
    newCards: number;
  }> {
    const cards = await this.cardRepository.find({
      where: { studySetId },
    });

    const cardIds = cards.map((c) => c.id);

    if (cardIds.length === 0) {
      return { totalCards: 0, masteredCards: 0, learningCards: 0, newCards: 0 };
    }

    const progressStats = await this.progressRepository
      .createQueryBuilder('progress')
      .where('progress.userId = :userId', { userId })
      .andWhere('progress.cardId IN (:...cardIds)', { cardIds })
      .getMany();

    const progressMap = new Map(progressStats.map((p) => [p.cardId, p]));

    let masteredCards = 0;
    let learningCards = 0;
    let newCards = 0;

    for (const card of cards) {
      const progress = progressMap.get(card.id);
      if (!progress) {
        newCards++;
      } else if (progress.repetitions >= 3) {
        masteredCards++;
      } else {
        learningCards++;
      }
    }

    return {
      totalCards: cards.length,
      masteredCards,
      learningCards,
      newCards,
    };
  }

  async getSessionHistory(
    userId: string,
    studySetId?: string,
    page = 1,
    limit = 20,
  ): Promise<{ sessions: StudySession[]; total: number }> {
    const queryBuilder = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.studySet', 'studySet')
      .where('session.userId = :userId', { userId });

    if (studySetId) {
      queryBuilder.andWhere('session.studySetId = :studySetId', { studySetId });
    }

    const [sessions, total] = await queryBuilder
      .orderBy('session.startedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { sessions, total };
  }

  async getStudyStats(userId: string): Promise<{
    totalSessions: number;
    totalCardsStudied: number;
    totalTimeSpent: number;
    averageScore: number;
  }> {
    const result = await this.sessionRepository
      .createQueryBuilder('session')
      .select('COUNT(*)', 'totalSessions')
      .addSelect('SUM(session.cardsStudied)', 'totalCardsStudied')
      .addSelect('SUM(session.timeSpentSeconds)', 'totalTimeSpent')
      .addSelect('AVG(session.score)', 'averageScore')
      .where('session.userId = :userId', { userId })
      .andWhere('session.endedAt IS NOT NULL')
      .getRawOne();

    return {
      totalSessions: Number(result.totalSessions) || 0,
      totalCardsStudied: Number(result.totalCardsStudied) || 0,
      totalTimeSpent: Number(result.totalTimeSpent) || 0,
      averageScore: Number(result.averageScore) || 0,
    };
  }
}
