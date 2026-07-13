import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudySetVersion, VersionAction } from './entities/study-set-version.entity';

@Injectable()
export class VersionsService {
  constructor(
    @InjectRepository(StudySetVersion)
    private readonly versionRepository: Repository<StudySetVersion>,
  ) {}

  async create(
    studySetId: string,
    userId: string,
    action: VersionAction,
    data: Record<string, any>,
    cardsSnapshot?: any[],
    description?: string,
  ): Promise<StudySetVersion> {
    const version = this.versionRepository.create({
      studySetId,
      userId,
      action,
      data,
      cardsSnapshot,
      description,
      cardsCount: cardsSnapshot?.length || 0,
    });

    return this.versionRepository.save(version);
  }

  async findByStudySet(
    studySetId: string,
    page = 1,
    limit = 20,
  ): Promise<{ versions: StudySetVersion[]; total: number }> {
    const [versions, total] = await this.versionRepository.findAndCount({
      where: { studySetId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { versions, total };
  }

  async findById(id: string): Promise<StudySetVersion> {
    const version = await this.versionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!version) {
      throw new NotFoundException('Version not found');
    }

    return version;
  }

  async getLatestVersion(studySetId: string): Promise<StudySetVersion | null> {
    return this.versionRepository.findOne({
      where: { studySetId },
      order: { createdAt: 'DESC' },
    });
  }

  async getVersionHistory(studySetId: string, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const versions = await this.versionRepository
      .createQueryBuilder('version')
      .where('version.studySetId = :studySetId', { studySetId })
      .andWhere('version.createdAt >= :cutoffDate', { cutoffDate })
      .orderBy('version.createdAt', 'DESC')
      .getMany();

    return versions;
  }

  async compareVersions(versionId1: string, versionId2: string) {
    const [v1, v2] = await Promise.all([
      this.findById(versionId1),
      this.findById(versionId2),
    ]);

    const cards1 = v1.cardsSnapshot || [];
    const cards2 = v2.cardsSnapshot || [];

    return {
      version1: {
        id: v1.id,
        createdAt: v1.createdAt,
        action: v1.action,
        cardsCount: v1.cardsCount,
      },
      version2: {
        id: v2.id,
        createdAt: v2.createdAt,
        action: v2.action,
        cardsCount: v2.cardsCount,
      },
      diff: {
        added: cards2.length - cards1.length,
        cards1Count: cards1.length,
        cards2Count: cards2.length,
      },
    };
  }

  async restoreVersion(versionId: string, userId: string, studySetId: string) {
    const version = await this.findById(versionId);

    if (!version.cardsSnapshot) {
      throw new NotFoundException('No cards snapshot available');
    }

    // Create a new version for the restore action
    const restoreVersion = await this.create(
      studySetId,
      userId,
      VersionAction.UPDATE,
      { restoredFrom: versionId },
      version.cardsSnapshot,
      `Restored from version ${versionId}`,
    );

    return restoreVersion;
  }
}
