import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService, SearchFilters } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search study sets, users, and tags' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'type', required: false, enum: ['study_set', 'user', 'all'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Query('q') query: string,
    @Query('type') type?: 'study_set' | 'user' | 'all',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: SearchFilters = { type };
    const result = await this.searchService.search(
      query,
      filters,
      Number(page) || 1,
      Number(limit) || 20,
    );
    return { success: true, data: result };
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiQuery({ name: 'q', required: true })
  async getSuggestions(@Query('q') query: string) {
    const suggestions = await this.searchService.getSuggestions(query);
    return { success: true, data: suggestions };
  }
}
