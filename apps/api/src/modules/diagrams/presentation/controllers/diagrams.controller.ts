import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { DiagramsService } from '../../application/diagrams.service';

@Controller('diagrams')
@UseGuards(JwtAuthGuard)
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  // ============ Diagram CRUD ============

  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() body: { title: string; description?: string; imageUrl: string; studySetId?: string },
  ) {
    return this.diagramsService.create({
      userId: req.user.id,
      ...body,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.diagramsService.getDiagramWithLabels(id);
    await this.diagramsService.incrementViewCount(id);
    return result;
  }

  @Get()
  async findByUser(
    @Request() req: { user: { id: string } },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.diagramsService.findByUser(
      req.user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
    @Body() body: { title?: string; description?: string; imageUrl?: string },
  ) {
    return this.diagramsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    await this.diagramsService.delete(id, req.user.id);
    return { success: true };
  }

  @Post(':id/copy')
  async copy(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.diagramsService.copyDiagram(id, req.user.id);
  }

  // ============ Labels ============

  @Post(':id/labels')
  async addLabel(
    @Param('id') diagramId: string,
    @Body() body: { xPosition: number; yPosition: number; term: string; definition: string; hint?: string },
  ) {
    return this.diagramsService.addLabel({ diagramId, ...body });
  }

  @Patch('labels/:labelId')
  async updateLabel(
    @Param('labelId') labelId: string,
    @Body() body: { term?: string; definition?: string; hint?: string; xPosition?: number; yPosition?: number },
  ) {
    return this.diagramsService.updateLabel(labelId, body);
  }

  @Delete('labels/:labelId')
  async deleteLabel(@Param('labelId') labelId: string) {
    await this.diagramsService.deleteLabel(labelId);
    return { success: true };
  }

  @Post(':id/labels/bulk')
  async bulkAddLabels(
    @Param('id') diagramId: string,
    @Body()
    body: {
      labels: Array<{ xPosition: number; yPosition: number; term: string; definition: string; hint?: string }>;
    },
  ) {
    return this.diagramsService.bulkAddLabels(diagramId, body.labels);
  }

  @Put(':id/labels/reorder')
  async reorderLabels(@Param('id') diagramId: string, @Body() body: { labelIds: string[] }) {
    await this.diagramsService.reorderLabels(diagramId, body.labelIds);
    return { success: true };
  }
}
