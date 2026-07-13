import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { StudySetTag } from './entities/study-set-tag.entity';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(StudySetTag)
    private readonly studySetTagRepository: Repository<StudySetTag>,
  ) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    const slug = Tag.toSlug(dto.name);

    const existing = await this.tagRepository.findOne({
      where: [{ name: dto.name }, { slug }],
    });

    if (existing) {
      throw new ConflictException('Tag already exists');
    }

    const tag = this.tagRepository.create({
      name: dto.name,
      slug,
      description: dto.description,
      color: dto.color || '#3B82F6',
      icon: dto.icon,
    });

    return this.tagRepository.save(tag);
  }

  async findById(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async findBySlug(slug: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { slug } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async findAll(
    page = 1,
    limit = 50,
    search?: string,
  ): Promise<{ tags: Tag[]; total: number }> {
    const queryBuilder = this.tagRepository.createQueryBuilder('tag');

    if (search) {
      queryBuilder.where('tag.name ILIKE :search', { search: `%${search}%` });
    }

    const [tags, total] = await queryBuilder
      .orderBy('tag.usageCount', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { tags, total };
  }

  async findPopular(limit = 20): Promise<Tag[]> {
    return this.tagRepository.find({
      order: { usageCount: 'DESC' },
      take: limit,
    });
  }

  async update(id: string, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findById(id);

    if (dto.name !== undefined) {
      tag.name = dto.name;
      tag.slug = Tag.toSlug(dto.name);
    }
    if (dto.description !== undefined) tag.description = dto.description;
    if (dto.color !== undefined) tag.color = dto.color;
    if (dto.icon !== undefined) tag.icon = dto.icon;

    return this.tagRepository.save(tag);
  }

  async delete(id: string): Promise<void> {
    const tag = await this.findById(id);
    await this.tagRepository.delete(id);
  }

  async findOrCreate(name: string): Promise<Tag> {
    const slug = Tag.toSlug(name);

    let tag = await this.tagRepository.findOne({ where: { slug } });
    if (tag) {
      return tag;
    }

    tag = this.tagRepository.create({ name, slug });
    return this.tagRepository.save(tag);
  }

  async addToStudySet(studySetId: string, tagId: string): Promise<void> {
    const existing = await this.studySetTagRepository.findOne({
      where: { studySetId, tagId },
    });

    if (!existing) {
      await this.studySetTagRepository.save({ studySetId, tagId });
      await this.tagRepository.increment({ id: tagId }, 'studySetsCount', 1);
      await this.tagRepository.increment({ id: tagId }, 'usageCount', 1);
    }
  }

  async removeFromStudySet(studySetId: string, tagId: string): Promise<void> {
    await this.studySetTagRepository.delete({ studySetId, tagId });
    await this.tagRepository.decrement({ id: tagId }, 'studySetsCount', 1);
    await this.tagRepository.decrement({ id: tagId }, 'usageCount', 1);
  }

  async getStudySetTags(studySetId: string): Promise<Tag[]> {
    const studySetTags = await this.studySetTagRepository.find({
      where: { studySetId },
      relations: ['tag'],
    });
    return studySetTags.map((st) => st.tag);
  }

  async setStudySetTags(studySetId: string, tagIds: string[]): Promise<void> {
    await this.studySetTagRepository.delete({ studySetId });

    if (tagIds.length > 0) {
      const studySetTags = tagIds.map((tagId) => ({
        studySetId,
        tagId,
      }));
      await this.studySetTagRepository.save(studySetTags);
    }
  }
}
