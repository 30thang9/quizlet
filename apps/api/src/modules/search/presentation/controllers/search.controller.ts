import { Controller, Get, Query } from '@nestjs/common';
import { SearchService, SearchFilters, SearchResult } from '../../application/search.service';
import { Visibility } from '../../../study-sets/domain/entities/study-set.entity';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('study-sets')
  async searchStudySets(
    @Query('q') query?: string,
    @Query('userId') userId?: string,
    @Query('tags') tags?: string,
    @Query('subject') subject?: string,
    @Query('visibility') visibility?: Visibility,
    @Query('sortBy') sortBy?: 'relevance' | 'created' | 'alphabetical' | 'popular',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<SearchResult> {
    const filters: SearchFilters = {
      query,
      userId,
      tags: tags ? tags.split(',') : undefined,
      subject,
      visibility,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    };

    return this.searchService.search(filters);
  }

  @Get('users')
  async searchUsers(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.searchUsers(query, limit ? parseInt(limit, 10) : 10);
  }

  @Get('tags')
  async searchTags(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.searchTags(query, limit ? parseInt(limit, 10) : 20);
  }

  @Get('subjects/popular')
  async getPopularSubjects(@Query('limit') limit?: string) {
    return this.searchService.getPopularSubjects(limit ? parseInt(limit, 10) : 10);
  }
}
