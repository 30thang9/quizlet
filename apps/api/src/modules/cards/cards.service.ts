import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto, UpdateCardDto, ReviewCardDto } from './dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async findById(id: string): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  async findByStudySet(studySetId: string): Promise<Card[]> {
    return this.cardRepository.find({
      where: { studySetId },
      order: { position: 'ASC' },
    });
  }

  async findDueCards(studySetId: string): Promise<Card[]> {
    return this.cardRepository
      .createQueryBuilder('card')
      .where('card.studySetId = :studySetId', { studySetId })
      .andWhere(
        '(card.nextReviewAt IS NULL OR card.nextReviewAt <= :now)',
        { now: new Date() },
      )
      .orderBy('card.position', 'ASC')
      .getMany();
  }

  async findByIds(ids: string[]): Promise<Card[]> {
    return this.cardRepository.find({ where: { id: In(ids) } });
  }

  async create(studySetId: string, dto: CreateCardDto): Promise<Card> {
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

    return this.cardRepository.save(card);
  }

  async update(id: string, dto: UpdateCardDto): Promise<Card> {
    const card = await this.findById(id);

    if (dto.term !== undefined) card.term = dto.term;
    if (dto.definition !== undefined) card.definition = dto.definition;
    if (dto.imageUrl !== undefined) card.imageUrl = dto.imageUrl;
    if (dto.audioUrl !== undefined) card.audioUrl = dto.audioUrl;

    return this.cardRepository.save(card);
  }

  async delete(id: string): Promise<void> {
    const card = await this.findById(id);
    await this.cardRepository.delete(id);
  }

  async review(id: string, dto: ReviewCardDto): Promise<Card> {
    const card = await this.findById(id);
    card.updateSpacedRepetition(dto.quality);
    return this.cardRepository.save(card);
  }

  async toggleStar(id: string): Promise<Card> {
    const card = await this.findById(id);
    card.isStarred = !card.isStarred;
    return this.cardRepository.save(card);
  }

  async reorder(studySetId: string, cardIds: string[]): Promise<Card[]> {
    const cards = await this.findByStudySet(studySetId);
    const cardMap = new Map(cards.map((c) => [c.id, c]));

    const reorderedCards: Card[] = [];
    for (let i = 0; i < cardIds.length; i++) {
      const card = cardMap.get(cardIds[i]);
      if (card) {
        card.position = i;
        reorderedCards.push(card);
      }
    }

    return this.cardRepository.save(reorderedCards);
  }

  async bulkCreate(studySetId: string, dtos: CreateCardDto[]): Promise<Card[]> {
    const cards = dtos.map((dto, index) =>
      this.cardRepository.create({
        studySetId,
        term: dto.term,
        definition: dto.definition,
        imageUrl: dto.imageUrl,
        audioUrl: dto.audioUrl,
        position: index,
      }),
    );

    return this.cardRepository.save(cards);
  }

  async deleteByStudySet(studySetId: string): Promise<void> {
    await this.cardRepository.delete({ studySetId });
  }

  async getStats(studySetId: string): Promise<{
    total: number;
    due: number;
    mastered: number;
    learning: number;
  }> {
    const cards = await this.cardRepository.find({ where: { studySetId } });

    const now = new Date();
    const due = cards.filter(
      (c) => !c.nextReviewAt || c.nextReviewAt <= now,
    ).length;
    const mastered = cards.filter((c) => c.memoryScore >= 80).length;
    const learning = cards.filter((c) => c.memoryScore > 0 && c.memoryScore < 80).length;

    return {
      total: cards.length,
      due,
      mastered,
      learning,
    };
  }
}
