import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagram, DiagramType } from './entities/diagram.entity';

export interface CreateDiagramDto {
  title: string;
  description?: string;
  type: DiagramType;
  data: Record<string, any>;
  studySetId?: string;
  isPublic?: boolean;
}

@Injectable()
export class DiagramsService {
  constructor(
    @InjectRepository(Diagram)
    private readonly diagramRepository: Repository<Diagram>,
  ) {}

  async create(userId: string, dto: CreateDiagramDto): Promise<Diagram> {
    const diagram = this.diagramRepository.create({
      ...dto,
      userId,
      isPublic: dto.isPublic ?? true,
    });

    return this.diagramRepository.save(diagram);
  }

  async findById(id: string): Promise<Diagram> {
    const diagram = await this.diagramRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }

    return diagram;
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const [diagrams, total] = await this.diagramRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { diagrams, total };
  }

  async findByStudySet(studySetId: string) {
    return this.diagramRepository.find({
      where: { studySetId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, userId: string, data: Partial<Diagram>): Promise<Diagram> {
    const diagram = await this.findById(id);

    if (diagram.userId !== userId) {
      throw new ForbiddenException('You can only edit your own diagrams');
    }

    Object.assign(diagram, data);
    return this.diagramRepository.save(diagram);
  }

  async delete(id: string, userId: string): Promise<void> {
    const diagram = await this.findById(id);

    if (diagram.userId !== userId) {
      throw new ForbiddenException('You can only delete your own diagrams');
    }

    await this.diagramRepository.delete(id);
  }

  async incrementViews(id: string): Promise<void> {
    await this.diagramRepository.increment({ id }, 'viewsCount', 1);
  }

  async toggleLike(id: string): Promise<boolean> {
    // This would need a separate likes table for proper implementation
    await this.diagramRepository.increment({ id }, 'likesCount', 1);
    return true;
  }
}
