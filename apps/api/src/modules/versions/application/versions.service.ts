import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  StudySetVersion,
  VersionAction,
  CardSnapshot,
} from '../domain/entities/study-set-version.entity';
import { StudySet } from '../../study-sets/domain/entities/study-set.entity';
import { Card } from '../../cards/domain/entities/card.entity';

@Injectable()
export class VersionsService {
  constructor(
    @InjectRepository(StudySetVersion)
    private readonly versionRepository: Repository<StudySetVersion>,
    @InjectRepository(StudySet)
    private readonly studySetRepository: Repository<StudySet>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async createVersion(
    studySetId: string,
    userId: string,
    action: VersionAction,
    changeSummary?: string,
  ): Promise<StudySetVersion> {
    // Get current study set
    const studySet = await this.studySetRepository.findOne({
      where: { id: studySetId },
    });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    // Get all cards
    const cards = await this.cardRepository.find({
      where: { studySetId },
    });

    const cardsSnapshot: CardSnapshot[] = cards.map((card) => ({
      id: card.id,
      term: card.term,
      definition: card.definition,
    }));

    // Mark previous versions as not current
    await this.versionRepository.update(
      { studySetId, isCurrent: true },
      { isCurrent: false },
    );

    // Create new version
    const version = this.versionRepository.create({
      studySetId,
      userId,
      action,
      title: studySet.title,
      description: studySet.description,
      cardsSnapshot,
      cardCount: cards.length,
      changeSummary,
      isCurrent: true,
    });

    return this.versionRepository.save(version);
  }

  async getVersions(
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

  async getVersion(id: string): Promise<StudySetVersion | null> {
    return this.versionRepository.findOne({
      where: { id },
      relations: ['user', 'studySet'],
    });
  }

  async restoreVersion(
    versionId: string,
    userId: string,
  ): Promise<StudySet> {
    const version = await this.versionRepository.findOne({
      where: { id: versionId },
      relations: ['studySet'],
    });

    if (!version) {
      throw new NotFoundException('Version not found');
    }

    const studySet = version.studySet;
    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    // Create a restore version first
    await this.createVersion(
      studySet.id,
      userId,
      VersionAction.RESTORED,
      `Restored to version from ${version.createdAt.toISOString()}`,
    );

    // Delete current cards
    await this.cardRepository.delete({ studySetId: studySet.id });

    // Restore cards from snapshot
    const newCards = version.cardsSnapshot.map((cardSnapshot) =>
      this.cardRepository.create({
        studySetId: studySet.id,
        term: cardSnapshot.term,
        definition: cardSnapshot.definition,
      }),
    );

    await this.cardRepository.save(newCards);

    return studySet;
  }

  async compareVersions(
    versionId1: string,
    versionId2: string,
  ): Promise<{
    added: CardSnapshot[];
    removed: CardSnapshot[];
    modified: { before: CardSnapshot; after: CardSnapshot }[];
  }> {
    const [v1, v2] = await Promise.all([
      this.getVersion(versionId1),
      this.getVersion(versionId2),
    ]);

    if (!v1 || !v2) {
      throw new NotFoundException('Version not found');
    }

    const cards1 = new Map(v1.cardsSnapshot.map((c) => [c.id, c]));
    const cards2 = new Map(v2.cardsSnapshot.map((c) => [c.id, c]));

    const added: CardSnapshot[] = [];
    const removed: CardSnapshot[] = [];
    const modified: { before: CardSnapshot; after: CardSnapshot }[] = [];

    // Find added and modified in v2
    for (const [id, card2] of cards2) {
      const card1 = cards1.get(id);
      if (!card1) {
        added.push(card2);
      } else if (card1.term !== card2.term || card1.definition !== card2.definition) {
        modified.push({ before: card1, after: card2 });
      }
    }

    // Find removed from v1
    for (const [id, card1] of cards1) {
      if (!cards2.has(id)) {
        removed.push(card1);
      }
    }

    return { added, removed, modified };
  }
}
