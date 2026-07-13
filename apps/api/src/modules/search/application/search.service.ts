import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudySet } from '../../study-sets/domain/entities/study-set.entity';
import { User } from '../../users/domain/entities/user.entity';
import { Tag } from '../../tags/domain/entities/tag.entity';
import { Visibility } from '../../study-sets/domain/entities/study-set.entity';

export interface SearchFilters {
  query?: string;
  userId?: string;
  tags?: string[];
  subject?: string;
  visibility?: Visibility;
  sortBy?: 'relevance' | 'created' | 'alphabetical' | 'popular';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  studySets: StudySet[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(StudySet)
    private readonly studySetRepository: Repository<StudySet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async search(filters: SearchFilters): Promise<SearchResult> {
    const {
      query,
      userId,
      tags,
      subject,
      visibility,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
    } = filters;

    const queryBuilder = this.studySetRepository
      .createQueryBuilder('studySet')
      .leftJoinAndSelect('studySet.user', 'user')
      .leftJoinAndSelect('studySet.tags', 'tags')
      .where('studySet.deletedAt IS NULL');

    // Visibility filter
    if (visibility) {
      queryBuilder.andWhere('studySet.visibility = :visibility', { visibility });
    } else {
      // Default: only public sets
      queryBuilder.andWhere('studySet.visibility = :visibility', {
        visibility: Visibility.PUBLIC,
      });
    }

    // Search query
    if (query) {
      queryBuilder.andWhere(
        '(studySet.title ILIKE :query OR studySet.description ILIKE :query)',
        { query: `%${query}%` },
      );
    }

    // User filter
    if (userId) {
      queryBuilder.andWhere('studySet.userId = :userId', { userId });
    }

    // Subject filter
    if (subject) {
      queryBuilder.andWhere('studySet.subject = :subject', { subject });
    }

    // Tags filter
    if (tags && tags.length > 0) {
      queryBuilder.andWhere('tags.name IN (:...tags)', { tags });
    }

    // Sorting
    switch (sortBy) {
      case 'created':
        queryBuilder.orderBy('studySet.createdAt', 'DESC');
        break;
      case 'alphabetical':
        queryBuilder.orderBy('studySet.title', 'ASC');
        break;
      case 'popular':
        queryBuilder.orderBy('studySet.viewCount', 'DESC');
        break;
      case 'relevance':
      default:
        if (query) {
          queryBuilder.orderBy(
            `CASE 
              WHEN studySet.title ILIKE :exactQuery THEN 1
              WHEN studySet.title ILIKE :startQuery THEN 2
              ELSE 3
            END`,
            'ASC',
          ).setParameters({
            exactQuery: `%${query}%`,
            startQuery: `${query}%`,
          });
        } else {
          queryBuilder.orderBy('studySet.createdAt', 'DESC');
        }
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const studySets = await queryBuilder.getMany();

    return {
      studySets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchUsers(query: string, limit = 10): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email ILIKE :query OR user.username ILIKE :query', {
        query: `%${query}%`,
      })
      .take(limit)
      .getMany();
  }

  async searchTags(query: string, limit = 20): Promise<Tag[]> {
    return this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.name ILIKE :query', { query: `%${query}%` })
      .orderBy('tag.usageCount', 'DESC')
      .take(limit)
      .getMany();
  }

  async getPopularSubjects(limit = 10): Promise<string[]> {
    const result = await this.studySetRepository
      .createQueryBuilder('studySet')
      .select('DISTINCT studySet.subject', 'subject')
      .where('studySet.subject IS NOT NULL')
      .andWhere('studySet.subject != \'\'')
      .orderBy('COUNT(*)', 'DESC')
      .groupBy('studySet.subject')
      .limit(limit)
      .getRawMany();

    return result.map((r) => r.subject);
  }
}
