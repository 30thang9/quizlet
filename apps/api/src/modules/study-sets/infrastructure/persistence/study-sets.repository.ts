import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { StudySet, Visibility } from '../../domain/entities/study-set.entity';

@Injectable()
export class StudySetsRepository {
  constructor(
    @InjectRepository(StudySet)
    private readonly repo: Repository<StudySet>,
  ) {}

  async findById(id: string): Promise<StudySet | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string, options: { page?: number; limit?: number } = {}): Promise<StudySet[]> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async findPublic(options: { page?: number; limit?: number; search?: string; subject?: string } = {}): Promise<StudySet[]> {
    const { page = 1, limit = 20, search, subject } = options;
    const skip = (page - 1) * limit;

    const where: any = { visibility: Visibility.PUBLIC };

    if (search) {
      where.title = Like(`%${search}%`);
    }

    if (subject) {
      where.subject = subject;
    }

    return this.repo.find({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async save(studySet: StudySet): Promise<StudySet> {
    return this.repo.save(studySet);
  }

  async update(id: string, data: Partial<StudySet>): Promise<StudySet> {
    await this.repo.update(id, data);
    return this.findById(id) as Promise<StudySet>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.repo.increment({ id }, 'viewCount', 1);
  }

  async incrementLikeCount(id: string): Promise<void> {
    await this.repo.increment({ id }, 'likeCount', 1);
  }

  async decrementLikeCount(id: string): Promise<void> {
    await this.repo.decrement({ id, likeCount: 0 }, 'likeCount', 0);
    await this.repo.decrement({ id, likeCount: 1 }, 'likeCount', 1);
  }
}
