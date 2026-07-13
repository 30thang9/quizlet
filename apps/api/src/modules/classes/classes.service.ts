import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Class, ClassRole } from './entities/class.entity';
import { ClassMember } from './entities/class-member.entity';
import { ClassStudySet } from './entities/class-study-set.entity';
import { CreateClassDto, UpdateClassDto } from './dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(ClassMember)
    private readonly memberRepository: Repository<ClassMember>,
    @InjectRepository(ClassStudySet)
    private readonly classStudySetRepository: Repository<ClassStudySet>,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: string, dto: CreateClassDto): Promise<Class> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const classEntity = queryRunner.manager.create(Class, {
        userId,
        name: dto.name,
        description: dto.description,
        coverImageUrl: dto.coverImageUrl,
        isPublic: dto.isPublic ?? false,
        inviteCode: Class.generateInviteCode(),
        membersCount: 1,
      });

      const savedClass = await queryRunner.manager.save(classEntity);

      const member = queryRunner.manager.create(ClassMember, {
        classId: savedClass.id,
        userId,
        role: ClassRole.OWNER,
        joinedAt: new Date(),
      });
      await queryRunner.manager.save(member);

      await queryRunner.commitTransaction();
      return this.findById(savedClass.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }
    return classEntity;
  }

  async findAll(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ classes: Class[]; total: number }> {
    const [classes, total] = await this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.user', 'user')
      .innerJoin('class_members', 'member', 'member.class_id = class.id AND member.user_id = :userId', { userId })
      .orderBy('class.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { classes, total };
  }

  async update(id: string, userId: string, dto: UpdateClassDto): Promise<Class> {
    const classEntity = await this.findById(id);
    const isOwner = await this.isOwner(id, userId);
    
    if (!isOwner) {
      throw new ForbiddenException('Only owner can update class');
    }

    if (dto.name !== undefined) classEntity.name = dto.name;
    if (dto.description !== undefined) classEntity.description = dto.description;
    if (dto.coverImageUrl !== undefined) classEntity.coverImageUrl = dto.coverImageUrl;
    if (dto.isPublic !== undefined) classEntity.isPublic = dto.isPublic;

    return this.classRepository.save(classEntity);
  }

  async delete(id: string, userId: string): Promise<void> {
    const isOwner = await this.isOwner(id, userId);
    if (!isOwner) {
      throw new ForbiddenException('Only owner can delete class');
    }
    await this.classRepository.softDelete(id);
  }

  async joinByInviteCode(inviteCode: string, userId: string): Promise<ClassMember> {
    const classEntity = await this.classRepository.findOne({
      where: { inviteCode },
    });

    if (!classEntity) {
      throw new NotFoundException('Invalid invite code');
    }

    const existing = await this.memberRepository.findOne({
      where: { classId: classEntity.id, userId },
    });

    if (existing) {
      throw new BadRequestException('Already a member');
    }

    const member = this.memberRepository.create({
      classId: classEntity.id,
      userId,
      role: ClassRole.STUDENT,
      joinedAt: new Date(),
    });

    await this.memberRepository.save(member);
    await this.classRepository.increment({ id: classEntity.id }, 'membersCount', 1);

    return member;
  }

  async leave(id: string, userId: string): Promise<void> {
    const isOwner = await this.isOwner(id, userId);
    if (isOwner) {
      throw new BadRequestException('Owner cannot leave class');
    }

    const member = await this.memberRepository.findOne({
      where: { classId: id, userId },
    });

    if (!member) {
      throw new NotFoundException('Not a member');
    }

    await this.memberRepository.delete(member.id);
    await this.classRepository.decrement({ id }, 'membersCount', 1);
  }

  async getMembers(classId: string): Promise<ClassMember[]> {
    return this.memberRepository.find({
      where: { classId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async addStudySet(classId: string, studySetId: string, userId: string): Promise<ClassStudySet> {
    const isTeacher = await this.isTeacher(classId, userId);
    if (!isTeacher) {
      throw new ForbiddenException('Only owner or teacher can add study sets');
    }

    const existing = await this.classStudySetRepository.findOne({
      where: { classId, studySetId },
    });

    if (existing) {
      throw new BadRequestException('Study set already added');
    }

    const classStudySet = this.classStudySetRepository.create({
      classId,
      studySetId,
      assignedBy: userId,
    });

    const saved = await this.classStudySetRepository.save(classStudySet);
    await this.classRepository.increment({ id: classId }, 'studySetsCount', 1);

    return saved;
  }

  async removeStudySet(classId: string, studySetId: string, userId: string): Promise<void> {
    const isTeacher = await this.isTeacher(classId, userId);
    if (!isTeacher) {
      throw new ForbiddenException('Only owner or teacher can remove study sets');
    }

    await this.classStudySetRepository.delete({ classId, studySetId });
    await this.classRepository.decrement({ id: classId }, 'studySetsCount', 1);
  }

  async getStudySets(classId: string): Promise<ClassStudySet[]> {
    return this.classStudySetRepository.find({
      where: { classId },
      relations: ['studySet'],
    });
  }

  async isMember(classId: string, userId: string): Promise<boolean> {
    const count = await this.memberRepository.count({ where: { classId, userId } });
    return count > 0;
  }

  async isOwner(classId: string, userId: string): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: { classId, userId },
    });
    return member?.role === ClassRole.OWNER;
  }

  async isTeacher(classId: string, userId: string): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: { classId, userId },
    });
    return member?.role === ClassRole.OWNER || member?.role === ClassRole.TEACHER;
  }

  async regenerateInviteCode(id: string, userId: string): Promise<string> {
    const isOwner = await this.isOwner(id, userId);
    if (!isOwner) {
      throw new ForbiddenException('Only owner can regenerate invite code');
    }

    const newCode = Class.generateInviteCode();
    await this.classRepository.update(id, { inviteCode: newCode });
    return newCode;
  }
}
