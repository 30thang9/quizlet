import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';
import { StudySet } from '../study-sets/entities/study-set.entity';
import { CreateFolderDto, UpdateFolderDto } from './dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(StudySet)
    private readonly studySetRepository: Repository<StudySet>,
  ) {}

  async create(userId: string, dto: CreateFolderDto): Promise<Folder> {
    if (dto.parentId) {
      const parent = await this.folderRepository.findOne({
        where: { id: dto.parentId, userId },
      });
      if (!parent) {
        throw new NotFoundException('Parent folder not found');
      }
    }

    const folder = this.folderRepository.create({
      userId,
      name: dto.name,
      parentId: dto.parentId,
      color: dto.color || '#3B82F6',
      icon: dto.icon,
    });

    return this.folderRepository.save(folder);
  }

  async findAll(userId: string): Promise<Folder[]> {
    return this.folderRepository.find({
      where: { userId },
      relations: ['children'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: string, userId: string): Promise<Folder> {
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return folder;
  }

  async update(id: string, userId: string, dto: UpdateFolderDto): Promise<Folder> {
    const folder = await this.findById(id, userId);

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('Folder cannot be its own parent');
      }
      const parent = await this.folderRepository.findOne({
        where: { id: dto.parentId, userId },
      });
      if (!parent) {
        throw new NotFoundException('Parent folder not found');
      }
    }

    if (dto.name !== undefined) folder.name = dto.name;
    if (dto.color !== undefined) folder.color = dto.color;
    if (dto.icon !== undefined) folder.icon = dto.icon;
    if (dto.parentId !== undefined) folder.parentId = dto.parentId;

    return this.folderRepository.save(folder);
  }

  async delete(id: string, userId: string): Promise<void> {
    const folder = await this.findById(id, userId);
    await this.folderRepository.remove(folder);
  }

  async getStudySets(
    folderId: string,
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ studySets: StudySet[]; total: number }> {
    await this.findById(folderId, userId);

    const [studySets, total] = await this.studySetRepository.findAndCount({
      where: { folderId, userId },
      relations: ['user'],
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { studySets, total };
  }

  async addStudySet(folderId: string, studySetId: string, userId: string): Promise<StudySet> {
    await this.findById(folderId, userId);

    const studySet = await this.studySetRepository.findOne({
      where: { id: studySetId },
    });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only add your own study sets');
    }

    const oldFolderId = studySet.folderId;
    studySet.folderId = folderId;
    await this.studySetRepository.save(studySet);

    if (oldFolderId) {
      await this.updateStudySetCounts(oldFolderId);
    }
    await this.updateStudySetCounts(folderId);

    return studySet;
  }

  async removeStudySet(folderId: string, studySetId: string, userId: string): Promise<StudySet> {
    await this.findById(folderId, userId);

    const studySet = await this.studySetRepository.findOne({
      where: { id: studySetId, folderId },
    });

    if (!studySet) {
      throw new NotFoundException('Study set not found in this folder');
    }

    if (studySet.userId !== userId) {
      throw new ForbiddenException('You can only remove your own study sets');
    }

    studySet.folderId = undefined as any;
    await this.studySetRepository.save(studySet);
    await this.updateStudySetCounts(folderId);

    return studySet;
  }

  private async updateStudySetCounts(folderId: string): Promise<void> {
    const count = await this.studySetRepository.count({ where: { folderId } });
    let totalCards = 0;

    if (count > 0) {
      const studySets = await this.studySetRepository.find({
        where: { folderId },
        select: ['cardsCount'],
      });
      totalCards = studySets.reduce((sum, ss) => sum + (ss.cardsCount || 0), 0);
    }

    await this.folderRepository.update(folderId, {
      studySetCount: count,
      totalCards,
    });
  }
}
