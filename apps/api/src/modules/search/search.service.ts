import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { StudySet } from '../study-sets/entities/study-set.entity';
import { User } from '../users/entities/user.entity';
import { Tag } from '../tags/entities/tag.entity';

export interface SearchFilters {
  type?: 'study_set' | 'user' | 'all';
  category?: string;
  subject?: string;
  level?: string;
  minCards?: number;
  maxCards?: number;
  isPublic?: boolean;
  tags?: string[];
}

export interface SearchResult {
  studySets?: StudySet[];
  users?: User[];
  tags?: Tag[];
  total: number;
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

  async search(
    query: string,
    filters: SearchFilters = {},
    page = 1,
    limit = 20,
  ): Promise<SearchResult> {
    const result: SearchResult = { total: 0 };
    const { type = 'all' } = filters;

    if (type === 'all' || type === 'study_set') {
      const studySetResult = await this.searchStudySets(query, filters, page, limit);
      result.studySets = studySetResult.items;
      result.total += studySetResult.total;
    }

    if (type === 'all' || type === 'user') {
      const userResult = await this.searchUsers(query, page, limit);
      result.users = userResult.items;
      result.total += userResult.total;
    }

    const tagResult = await this.searchTags(query, limit);
    result.tags = tagResult.items;

    return result;
  }

  private async searchStudySets(
    query: string,
    filters: SearchFilters,
    page: number,
    limit: number,
  ) {
    const queryBuilder = this.studySetRepository
      .createQueryBuilder('studySet')
      .leftJoinAndSelect('studySet.user', 'user')
      .where('studySet.title ILIKE :query', { query: `%${query}%` })
      .orWhere('studySet.description ILIKE :query', { query: `%${query}%` });

    if (filters.isPublic !== undefined) {
      queryBuilder.andWhere('studySet.isPublic = :isPublic', { isPublic: filters.isPublic });
    }

    if (filters.category) {
      queryBuilder.andWhere('studySet.category = :category', { category: filters.category });
    }

    if (filters.minCards) {
      queryBuilder.andWhere('studySet.cardsCount >= :minCards', { minCards: filters.minCards });
    }

    if (filters.maxCards) {
      queryBuilder.andWhere('studySet.cardsCount <= :maxCards', { maxCards: filters.maxCards });
    }

    const [items, total] = await queryBuilder
      .orderBy('studySet.viewsCount', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, total };
  }

  private async searchUsers(query: string, page: number, limit: number) {
    const [items, total] = await this.userRepository.findAndCount({
      where: [
        { name: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total };
  }

  private async searchTags(query: string, limit: number) {
    const items = await this.tagRepository.find({
      where: { name: ILike(`%${query}%`) },
      take: limit,
      order: { usageCount: 'DESC' },
    });

    return { items, total: items.length };
  }

  async getSuggestions(query: string, limit = 5): Promise<string[]> {
    const studySets = await this.studySetRepository.find({
      where: { title: ILike(`%${query}%`) },
      select: ['title'],
      take: limit,
    });

    return studySets.map((ss) => ss.title);
  }
}
