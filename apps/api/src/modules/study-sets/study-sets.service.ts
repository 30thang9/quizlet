import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StudySet, StudySetVisibility } from './entities/study-set.entity';
import { Card } from './entities/card.entity';
import { CreateStudySetDto, UpdateStudySetDto, CreateCardDto } from './dto';

@Injectable()
export class StudySetsService {
  constructor(
    @InjectRepository(StudySet)
    private readonly studySetRepository: Repository<StudySet>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: string, dto: CreateStudySetDto): Promise<StudySet> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const studySet = queryRunner.manager.create(StudySet, {
        userId,
        title: dto.title,
        description: dto.description,
        visibility: dto.visibility || StudySetVisibility.PRIVATE,
        isPublished: false,
        cardsCount: dto.cards?.length || 0,
        thumbnailUrl: dto.thumbnailUrl,
      });

      const savedStudySet = await queryRunner.manager.save(studySet);

      if (dto.cards && dto.cards.length > 0) {
        const cards = dto.cards.map((cardDto, index) =>
          queryRunner.manager.create(Card, {
            studySetId: savedStudySet.id,
            term: cardDto.term,
            definition: cardDto.definition,
            imageUrl: cardDto.imageUrl,
            audioUrl: cardDto.audioUrl,
            position: index,
          }),
        );
        await queryRunner.manager.save(cards);
      }

      await queryRunner.commitTransaction();
      return this.findById(savedStudySet.id, userId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: string, userId?: string): Promise<StudySet> {
    const studySet = await this.studySetRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    if (studySet.visibility === StudySetVisibility.PRIVATE && studySet.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return studySet;
  }

  async findAll(
    userId?: string,
    page = 1,
    limit = 20,
    visibility?: StudySetVisibility,
    isPublished?: boolean,
  ): Promise<{ studySets: StudySet[]; total: number }> {
    const queryBuilder = this.studySetRepository
      .createQueryBuilder('studySet')
      .leftJoinAndSelect('studySet.user', 'user');

    if (userId) {
      queryBuilder.where('studySet.userId = :userId', { userId });
    }

    if (visibility) {
      queryBuilder.andWhere('studySet.visibility = :visibility', { visibility });
    }

    if (isPublished !== undefined) {
      queryBuilder.andWhere('studySet.isPublished = :isPublished', { isPublished });
    }

    const [studySets, total] = await queryBuilder
      .orderBy('studySet.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { studySets, total };
  }

  async update(id: string, userId: string, dto: UpdateStudySetDto): Promise<StudySet> {
    const studySet = await this.findById(id, userId);

    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only update your own study sets');
    }

    if (dto.title !== undefined) studySet.title = dto.title;
    if (dto.description !== undefined) studySet.description = dto.description;
    if (dto.visibility !== undefined) studySet.visibility = dto.visibility;
    if (dto.isPublished !== undefined) studySet.isPublished = dto.isPublished;
    if (dto.thumbnailUrl !== undefined) studySet.thumbnailUrl = dto.thumbnailUrl;
    if (dto.studySettings !== undefined) studySet.studySettings = dto.studySettings;

    return this.studySetRepository.save(studySet);
  }

  async delete(id: string, userId: string): Promise<void> {
    const studySet = await this.findById(id, userId);

    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only delete your own study sets');
    }

    await this.studySetRepository.softDelete(id);
  }

  async addCard(studySetId: string, userId: string, dto: CreateCardDto): Promise<Card> {
    const studySet = await this.findById(studySetId, userId);

    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only add cards to your own study sets');
    }

    const maxPosition = await this.cardRepository
      .createQueryBuilder('card')
      .where('card.studySetId = :studySetId', { studySetId })
      .select('MAX(card.position)', 'max')
      .getRawOne();

    const card = this.cardRepository.create({
      studySetId,
      term: dto.term,
      definition: dto.definition,
      imageUrl: dto.imageUrl,
      audioUrl: dto.audioUrl,
      position: (maxPosition?.max ?? -1) + 1,
    });

    const savedCard = await this.cardRepository.save(card);
    await this.updateCardsCount(studySetId);

    return savedCard;
  }

  async getCards(studySetId: string, userId?: string): Promise<Card[]> {
    await this.findById(studySetId, userId);

    return this.cardRepository.find({
      where: { studySetId },
      order: { position: 'ASC' },
    });
  }

  async updateCard(
    cardId: string,
    userId: string,
    data: Partial<CreateCardDto>,
  ): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['studySet'],
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.studySet.userId !== userId) {
      throw new ForbiddenException('You can only update cards in your own study sets');
    }

    if (data.term !== undefined) card.term = data.term;
    if (data.definition !== undefined) card.definition = data.definition;
    if (data.imageUrl !== undefined) card.imageUrl = data.imageUrl;
    if (data.audioUrl !== undefined) card.audioUrl = data.audioUrl;

    return this.cardRepository.save(card);
  }

  async deleteCard(cardId: string, userId: string): Promise<void> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['studySet'],
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.studySet.userId !== userId) {
      throw new ForbiddenException('You can only delete cards in your own study sets');
    }

    await this.cardRepository.delete(cardId);
    await this.updateCardsCount(card.studySetId);
  }

  private async updateCardsCount(studySetId: string): Promise<void> {
    const count = await this.cardRepository.count({ where: { studySetId } });
    await this.studySetRepository.update(studySetId, { cardsCount: count });
  }

  async search(
    query: string,
    page = 1,
    limit = 20,
  ): Promise<{ studySets: StudySet[]; total: number }> {
    const [studySets, total] = await this.studySetRepository
      .createQueryBuilder('studySet')
      .leftJoinAndSelect('studySet.user', 'user')
      .where('studySet.isPublished = :isPublished', { isPublished: true })
      .andWhere(
        '(studySet.title ILIKE :query OR studySet.description ILIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('studySet.views', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { studySets, total };
  }
}
