import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common';
import { TagsService } from '../../application/tags.service';
import { Tag } from '../../domain/entities/tag.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
  ): Promise<Tag[]> {
    if (search) {
      return this.tagsService.search(search);
    }
    return this.tagsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Tag | null> {
    return this.tagsService.findById(id);
  }

  @Post('find-or-create')
  async findOrCreate(
    @Body() body: { name: string; color?: string },
  ): Promise<Tag> {
    return this.tagsService.findOrCreate(body.name, body.color);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.tagsService.delete(id);
    return { success };
  }
}
