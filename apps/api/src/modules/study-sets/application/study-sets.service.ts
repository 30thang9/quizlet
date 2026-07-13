import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { StudySet, Visibility } from '../domain/entities/study-set';
import { Card } from '../../cards/domain/entities/card.entity';

export const IStudySetsRepository = 'IStudySetsRepository';
export const ICardsRepository = 'ICardsRepository';

export interface IStudySetsRepository {
  findById(id: string): Promise<StudySet | null>;
  findByUserId(userId: string, page?: number, limit?: number): Promise<StudySet[]>;
  findPublic(page?: number, limit?: number): Promise<StudySet[]>;
  search(query: string, page?: number, limit?: number): Promise<StudySet[]>;
  count(): Promise<number>;
  save(studySet: StudySet): Promise<void>;
  update(studySet: StudySet): Promise<void>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
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

    if (studySet.isPublic()) {
      await this.studySetsRepository.incrementViewCount(id);
      return studySet;
    }

    if (studySet.userId === userId) {
      return studySet;
    }

    throw new ForbiddenException('You do not have access to this study set');
  }

  async findByUserId(userId: string, page = 1, limit = 20): Promise<StudySet[]> {
    return this.studySetsRepository.findByUserId(userId, page, limit);
  }

  async findPublic(page = 1, limit = 20): Promise<StudySet[]> {
    return this.studySetsRepository.findPublic(page, limit);
  }

  async search(query: string, page = 1, limit = 20): Promise<StudySet[]> {
    return this.studySetsRepository.search(query, page, limit);
  }

  async create(data: CreateStudySetData): Promise<StudySet> {
    const studySet = StudySet.create({
      userId: data.userId,
      title: data.title,
      description: data.description,
      visibility: data.visibility || 'public',
      language: data.language,
      subject: data.subject,
    });

    await this.studySetsRepository.save(studySet);
    return studySet;
  }

  async update(id: string, userId: string, data: Partial<StudySet>): Promise<StudySet> {
    const studySet = await this.findById(id);

    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only update your own study sets');
    }

    if (data.title !== undefined) studySet.updateTitle(data.title);
    if (data.description !== undefined) studySet.updateDescription(data.description);
    if (data.visibility !== undefined) studySet.updateVisibility(data.visibility);

    await this.studySetsRepository.update(studySet);
    return studySet;
  }

  async delete(id: string, userId: string): Promise<void> {
    const studySet = await this.findById(id);

    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only delete your own study sets');
    }

    await this.studySetsRepository.softDelete(id);
  }

  async getCards(studySetId: string): Promise<Card[]> {
    await this.findById(studySetId);
    return this.cardsRepository.findByStudySetId(studySetId);
  }

  async createCard(data: CreateCardData): Promise<Card> {
    await this.findById(data.studySetId);

    const existingCards = await this.cardsRepository.findByStudySetId(data.studySetId);
    const position = existingCards.length;

    const card = new Card();
    card.id = crypto.randomUUID();
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

    await this.cardsRepository.updateCardCount(data.studySetId, position + 1);

    return savedCard;
  }

  async createCards(studySetId: string, cards: Omit<CreateCardData, 'studySetId'>[]): Promise<Card[]> {
    await this.findById(studySetId);

    const existingCards = await this.cardsRepository.findByStudySetId(studySetId);
    const startPosition = existingCards.length;

    const cardEntities = cards.map((card, index) => {
      const entity = new Card();
      entity.id = crypto.randomUUID();
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

    const remainingCards = await this.cardsRepository.findByStudySetId(card.studySetId);
    await this.cardsRepository.updateCardCount(card.studySetId, remainingCards.length);
  }
}
