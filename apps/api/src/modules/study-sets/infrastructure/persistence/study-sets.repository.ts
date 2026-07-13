import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull } from 'typeorm';
import { StudySetEntity, Visibility } from './entities/study-set.entity';
import { StudySet } from '../../domain/entities/study-set';
import { IStudySetRepository } from '../../domain/repositories/study-set.repository.interface';
import { StudySetMapper } from './mappers/study-set.mapper';

@Injectable()
export class StudySetsRepository implements IStudySetRepository {
  constructor(
    @InjectRepository(StudySetEntity)
    private readonly repo: Repository<StudySetEntity>,
  ) {}

  async findById(id: string): Promise<StudySet | null> {
    const entity = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user'],
    });
    return entity ? StudySetMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string, page = 1, limit = 20): Promise<StudySet[]> {
    const skip = (page - 1) * limit;
    const entities = await this.repo.find({
      where: { userId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return entities.map(StudySetMapper.toDomain);
  }

  async findPublic(page = 1, limit = 20): Promise<StudySet[]> {
    const skip = (page - 1) * limit;
    const entities = await this.repo.find({
      where: { visibility: Visibility.PUBLIC, deletedAt: IsNull() },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return entities.map(StudySetMapper.toDomain);
  }

  async search(query: string, page = 1, limit = 20): Promise<StudySet[]> {
    const skip = (page - 1) * limit;
    const entities = await this.repo.find({
      where: [
        { title: Like(`%${query}%`), visibility: Visibility.PUBLIC, deletedAt: IsNull() },
        { description: Like(`%${query}%`), visibility: Visibility.PUBLIC, deletedAt: IsNull() },
      ],
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return entities.map(StudySetMapper.toDomain);
  }

  async save(studySet: StudySet): Promise<void> {
    const entity = StudySetMapper.toEntity(studySet);
    await this.repo.save(entity);
  }

  async update(studySet: StudySet): Promise<void> {
    const entity = StudySetMapper.toEntity(studySet);
    await this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  async count(): Promise<number> {
    return this.repo.count({ where: { deletedAt: IsNull() } });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.repo.increment({ id }, 'viewCount', 1);
  }

  async incrementLikeCount(id: string): Promise<void> {
    await this.repo.increment({ id }, 'likeCount', 1);
  }

  async decrementLikeCount(id: string): Promise<void> {
    await this.repo.decrement({ id, likeCount: 1 }, 'likeCount', 1);
  }
}
