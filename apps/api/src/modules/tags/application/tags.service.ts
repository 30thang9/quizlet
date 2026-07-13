import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../domain/entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({
      order: { usageCount: 'DESC' },
      take: 100,
    });
  }

  async findById(id: string): Promise<Tag | null> {
    return this.tagRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Tag | null> {
    return this.tagRepository.findOne({ where: { name } });
  }

  async findOrCreate(name: string, color?: string): Promise<Tag> {
    let tag = await this.findByName(name.toLowerCase().trim());
    
    if (!tag) {
      tag = this.tagRepository.create({
        name: name.toLowerCase().trim(),
        color: color || this.getRandomColor(),
      });
      tag = await this.tagRepository.save(tag);
    }
    
    return tag;
  }

  async search(query: string): Promise<Tag[]> {
    return this.tagRepository
      .createQueryBuilder('tag')
      .where('LOWER(tag.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orderBy('tag.usageCount', 'DESC')
      .take(20)
      .getMany();
  }

  async incrementUsage(tagId: string): Promise<void> {
    await this.tagRepository.increment({ id: tagId }, 'usageCount', 1);
  }

  async decrementUsage(tagId: string): Promise<void> {
    await this.tagRepository
      .createQueryBuilder()
      .update(Tag)
      .set({ usageCount: () => 'GREATEST(usageCount - 1, 0)' })
      .where('id = :id', { id: tagId })
      .execute();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.tagRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private getRandomColor(): string {
    const colors = [
      '#ef4444', // red
      '#f97316', // orange
      '#eab308', // yellow
      '#22c55e', // green
      '#14b8a6', // teal
      '#3b82f6', // blue
      '#6366f1', // indigo
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#64748b', // slate
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
