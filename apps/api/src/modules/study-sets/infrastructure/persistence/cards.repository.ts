import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../../../cards/domain/entities/card.entity';

@Injectable()
export class CardsRepository {
  constructor(
    @InjectRepository(Card)
    private readonly repo: Repository<Card>,
  ) {}

  async findByStudySetId(studySetId: string): Promise<Card[]> {
    return this.repo.find({
      where: { studySetId },
      order: { position: 'ASC' },
    });
  }

  async findById(id: string): Promise<Card | null> {
    return this.repo.findOne({ where: { id } });
  }

  async save(card: Card): Promise<Card> {
    return this.repo.save(card);
  }

  async saveMany(cards: Card[]): Promise<Card[]> {
    return this.repo.save(cards);
  }

  async update(id: string, data: Partial<Card>): Promise<Card> {
    await this.repo.update(id, data);
    return this.findById(id) as Promise<Card>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async deleteByStudySetId(studySetId: string): Promise<void> {
    await this.repo.delete({ studySetId });
  }

  async updateCardCount(studySetId: string, count: number): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update('study_sets')
      .set({ cardCount: count })
      .where('id = :id', { id: studySetId })
      .execute();
  }
}
