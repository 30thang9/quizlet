import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DiagramsService } from './diagrams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Diagrams')
@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new diagram' })
  async create(@Request() req: any, @Body() body: any) {
    const diagram = await this.diagramsService.create(req.user.id, body);
    return { success: true, data: diagram };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get diagram by ID' })
  async findOne(@Param('id') id: string) {
    const diagram = await this.diagramsService.findById(id);
    await this.diagramsService.incrementViews(id);
    return { success: true, data: diagram };
  }

  @Get()
  @ApiOperation({ summary: 'Get user diagrams' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByUser(@Request() req: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.diagramsService.findByUser(
      req.user.id,
      Number(page),
      Number(limit),
    );
    return {
      success: true,
      data: {
        diagrams: result.diagrams,
        total: result.total,
      },
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update diagram' })
  async update(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    const diagram = await this.diagramsService.update(id, req.user.id, body);
    return { success: true, data: diagram };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete diagram' })
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.diagramsService.delete(id, req.user.id);
    return { success: true, message: 'Diagram deleted successfully' };
  }
}
