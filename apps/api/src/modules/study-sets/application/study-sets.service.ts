import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { StudySet, Visibility } from '../domain/entities/study-set.entity';
import { Card } from '../../cards/domain/entities/card.entity';

export const IStudySetsRepository = 'IStudySetsRepository';
export const ICardsRepository = 'ICardsRepository';

export interface IStudySetsRepository {
  findById(id: string): Promise<StudySet | null>;
  findByUserId(userId: string, options?: { page?: number; limit?: number }): Promise<StudySet[]>;
  findPublic(options?: { page?: number; limit?: number; search?: string; subject?: string }): Promise<StudySet[]>;
  count(): Promise<number>;
  save(studySet: StudySet): Promise<StudySet>;
  update(id: string, data: Partial<StudySet>): Promise<StudySet>;
  delete(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
  incrementLikeCount(id: string): Promise<void>;
  decrementLikeCount(id: string): Promise<void>;
}

export interface ICardsRepository {
  findByStudySetId(studySetId: string): Promise<Card[]>;
  findById(id: string): Promise<Card | null>;
  save(card: Card): Promise<Card>;
  saveMany(cards: Card[]): Promise<Card[]>;
  update(id: string, data: Partial<Card>): Promise<Card>;
  delete(id: string): Promise<void>;
  deleteByStudySetId(studySetId: string): Promise<void>;
  updateCardCount(studySetId: string, count: number): Promise<void>;
}

export interface CreateStudySetData {
  userId: string;
  title: string;
  description?: string;
  visibility?: Visibility;
  language?: string;
  subject?: string;
}

export interface CreateCardData {
  studySetId: string;
  term: string;
  definition: string;
  imageUrl?: string;
  audioUrl?: string;
}

@Injectable()
export class StudySetsService {
  constructor(
    @Inject(IStudySetsRepository)
    private readonly studySetsRepository: IStudySetsRepository,
    @Inject(ICardsRepository)
    private readonly cardsRepository: ICardsRepository,
  ) {}

  async findById(id: string): Promise<StudySet> {
    const studySet = await this.studySetsRepository.findById(id);
    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }
    return studySet;
  }

  async findByIdWithAccessCheck(id: string, userId?: string): Promise<StudySet> {
    const studySet = await this.findById(id);

    // Public sets are accessible to everyone
    if (studySet.visibility === Visibility.PUBLIC) {
      await this.studySetsRepository.incrementViewCount(id);
      return studySet;
    }

    // Check if user is the owner
    if (studySet.userId === userId) {
      return studySet;
    }

    throw new ForbiddenException('You do not have access to this study set');
  }

  async findByUserId(userId: string, page = 1, limit = 20): Promise<StudySet[]> {
    return this.studySetsRepository.findByUserId(userId, { page, limit });
  }

  async findPublic(page = 1, limit = 20, search?: string, subject?: string): Promise<StudySet[]> {
    return this.studySetsRepository.findPublic({ page, limit, search, subject });
  }

  async create(data: CreateStudySetData): Promise<StudySet> {
    const studySet = new StudySet();
    studySet.userId = data.userId;
    studySet.title = data.title;
    studySet.description = data.description || '';
    studySet.visibility = data.visibility || Visibility.PUBLIC;
    studySet.language = data.language || '';
    studySet.subject = data.subject || '';
    studySet.cardCount = 0;
    studySet.viewCount = 0;
    studySet.likeCount = 0;
    studySet.copyCount = 0;

    return this.studySetsRepository.save(studySet);
  }

  async update(id: string, userId: string, data: Partial<StudySet>): Promise<StudySet> {
    const studySet = await this.findById(id);

    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only update your own study sets');
    }

    return this.studySetsRepository.update(id, data);
  }

  async delete(id: string, userId: string): Promise<void> {
    const studySet = await this.findById(id);

    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only delete your own study sets');
    }

    await this.studySetsRepository.delete(id);
  }

  async getCards(studySetId: string): Promise<Card[]> {
    await this.findById(studySetId); // Verify study set exists
    return this.cardsRepository.findByStudySetId(studySetId);
  }

  async createCard(data: CreateCardData): Promise<Card> {
    await this.findById(data.studySetId); // Verify study set exists

    const existingCards = await this.cardsRepository.findByStudySetId(data.studySetId);
    const position = existingCards.length;

    const card = new Card();
    card.studySetId = data.studySetId;
    card.term = data.term;
    card.definition = data.definition;
    card.imageUrl = data.imageUrl;
    card.audioUrl = data.audioUrl;
    card.position = position;
    card.isStarred = false;
    card.memoryScore = 0;
    card.easeFactor = 2.5;
    card.intervalDays = 0;
    card.repetitions = 0;

    const savedCard = await this.cardsRepository.save(card);

    // Update card count
    await this.cardsRepository.updateCardCount(data.studySetId, position + 1);

    return savedCard;
  }

  async createCards(studySetId: string, cards: Omit<CreateCardData, 'studySetId'>[]): Promise<Card[]> {
    await this.findById(studySetId);

    const existingCards = await this.cardsRepository.findByStudySetId(studySetId);
    const startPosition = existingCards.length;

    const cardEntities = cards.map((card, index) => {
      const entity = new Card();
      entity.studySetId = studySetId;
      entity.term = card.term;
      entity.definition = card.definition;
      entity.imageUrl = card.imageUrl;
      entity.audioUrl = card.audioUrl;
      entity.position = startPosition + index;
      entity.isStarred = false;
      entity.memoryScore = 0;
      entity.easeFactor = 2.5;
      entity.intervalDays = 0;
      entity.repetitions = 0;
      return entity;
    });

    const savedCards = await this.cardsRepository.saveMany(cardEntities);

    // Update card count
    await this.cardsRepository.updateCardCount(studySetId, startPosition + cards.length);

    return savedCards;
  }

  async updateCard(cardId: string, userId: string, data: Partial<Card>): Promise<Card> {
    const card = await this.cardsRepository.findById(cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const studySet = await this.findById(card.studySetId);
    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only update cards in your own study sets');
    }

    return this.cardsRepository.update(cardId, data);
  }

  async deleteCard(cardId: string, userId: string): Promise<void> {
    const card = await this.cardsRepository.findById(cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const studySet = await this.findById(card.studySetId);
    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only delete cards in your own study sets');
    }

    await this.cardsRepository.delete(cardId);

    // Update card count
    const remainingCards = await this.cardsRepository.findByStudySetId(card.studySetId);
    await this.cardsRepository.updateCardCount(card.studySetId, remainingCards.length);
  }
}
