import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagram, DiagramLabel } from '../domain/entities/diagram.entity';

@Injectable()
export class DiagramsService {
  constructor(
    @InjectRepository(Diagram)
    private readonly diagramRepository: Repository<Diagram>,
    @InjectRepository(DiagramLabel)
    private readonly labelRepository: Repository<DiagramLabel>,
  ) {}

  // ============ Diagram CRUD ============

  async create(data: {
    userId: string;
    title: string;
    description?: string;
    imageUrl: string;
    studySetId?: string;
  }): Promise<Diagram> {
    const diagram = this.diagramRepository.create({
      ...data,
      viewCount: 0,
      copyCount: 0,
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

  async findByUser(userId: string, page = 1, limit = 20): Promise<{ diagrams: Diagram[]; total: number }> {
    const [diagrams, total] = await this.diagramRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { diagrams, total };
  }

  async update(
    id: string,
    userId: string,
    data: Partial<{ title: string; description: string; imageUrl: string }>,
  ): Promise<Diagram> {
    const diagram = await this.findById(id);

    if (diagram.userId !== userId) {
      throw new NotFoundException('Diagram not found');
    }

    Object.assign(diagram, data);
    return this.diagramRepository.save(diagram);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const diagram = await this.findById(id);

    if (diagram.userId !== userId) {
      throw new NotFoundException('Diagram not found');
    }

    await this.diagramRepository.remove(diagram);
    return true;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.diagramRepository.increment({ id }, 'viewCount', 1);
  }

  async copyDiagram(id: string, userId: string): Promise<Diagram> {
    const original = await this.findById(id);
    const labels = await this.getLabels(id);

    // Create new diagram
    const newDiagram = await this.create({
      userId,
      title: `${original.title} (Copy)`,
      description: original.description,
      imageUrl: original.imageUrl,
    });

    // Copy labels
    if (labels.length > 0) {
      const newLabels = labels.map((label) =>
        this.labelRepository.create({
          diagramId: newDiagram.id,
          xPosition: label.xPosition,
          yPosition: label.yPosition,
          term: label.term,
          definition: label.definition,
          hint: label.hint,
          position: label.position,
        }),
      );
      await this.labelRepository.save(newLabels);
    }

    // Increment copy count of original
    await this.diagramRepository.increment({ id: original.id }, 'copyCount', 1);

    return newDiagram;
  }

  // ============ Label CRUD ============

  async addLabel(data: {
    diagramId: string;
    xPosition: number;
    yPosition: number;
    term: string;
    definition: string;
    hint?: string;
    position?: number;
  }): Promise<DiagramLabel> {
    const label = this.labelRepository.create(data);
    return this.labelRepository.save(label);
  }

  async updateLabel(
    id: string,
    data: Partial<{ term: string; definition: string; hint: string; xPosition: number; yPosition: number }>,
  ): Promise<DiagramLabel> {
    const label = await this.labelRepository.findOne({ where: { id } });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    Object.assign(label, data);
    return this.labelRepository.save(label);
  }

  async deleteLabel(id: string): Promise<boolean> {
    const label = await this.labelRepository.findOne({ where: { id } });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    await this.labelRepository.remove(label);
    return true;
  }

  async getLabels(diagramId: string): Promise<DiagramLabel[]> {
    return this.labelRepository.find({
      where: { diagramId },
      order: { position: 'ASC' },
    });
  }

  async getDiagramWithLabels(id: string): Promise<{ diagram: Diagram; labels: DiagramLabel[] }> {
    const diagram = await this.findById(id);
    const labels = await this.getLabels(id);
    return { diagram, labels };
  }

  async bulkAddLabels(
    diagramId: string,
    labels: Array<{
      xPosition: number;
      yPosition: number;
      term: string;
      definition: string;
      hint?: string;
    }>,
  ): Promise<DiagramLabel[]> {
    const labelEntities = labels.map((label, index) =>
      this.labelRepository.create({
        diagramId,
        ...label,
        position: index,
      }),
    );
    return this.labelRepository.save(labelEntities);
  }

  async reorderLabels(diagramId: string, labelIds: string[]): Promise<void> {
    for (let i = 0; i < labelIds.length; i++) {
      await this.labelRepository.update(labelIds[i], { position: i });
    }
  }
}
