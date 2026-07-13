import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import {
  ClassEntity,
  ClassMember,
  Assignment,
  AssignmentProgress,
  ClassMemberRole,
} from '../domain/entities/class.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
    @InjectRepository(ClassMember)
    private readonly memberRepository: Repository<ClassMember>,
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentProgress)
    private readonly progressRepository: Repository<AssignmentProgress>,
  ) {}

  // Classes
  async create(data: {
    teacherId: string;
    name: string;
    subject?: string;
    gradeLevel?: string;
    description?: string;
  }): Promise<ClassEntity> {
    const classEntity = this.classRepository.create({
      ...data,
      enrollmentCode: ClassEntity.generateEnrollmentCode(),
    });
    return this.classRepository.save(classEntity);
  }

  async findById(id: string): Promise<ClassEntity> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    return classEntity;
  }

  async findByTeacher(teacherId: string): Promise<ClassEntity[]> {
    return this.classRepository.find({
      where: { teacherId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    teacherId: string,
    data: Partial<ClassEntity>,
  ): Promise<ClassEntity> {
    const classEntity = await this.classRepository.findOne({ where: { id } });
    if (!classEntity || classEntity.teacherId !== teacherId) {
      throw new NotFoundException('Class not found');
    }

    Object.assign(classEntity, data);
    return this.classRepository.save(classEntity);
  }

  async delete(id: string, teacherId: string): Promise<boolean> {
    const classEntity = await this.classRepository.findOne({ where: { id } });
    if (!classEntity || classEntity.teacherId !== teacherId) {
      throw new NotFoundException('Class not found');
    }

    await this.classRepository.remove(classEntity);
    return true;
  }

  // Enrollment
  async joinByCode(enrollmentCode: string, userId: string): Promise<ClassMember> {
    const classEntity = await this.classRepository.findOne({
      where: { enrollmentCode },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    const existingMember = await this.memberRepository.findOne({
      where: { classId: classEntity.id, userId },
    });

    if (existingMember) {
      throw new BadRequestException('Already a member of this class');
    }

    const member = this.memberRepository.create({
      classId: classEntity.id,
      userId,
      role: ClassMemberRole.STUDENT,
    });

    return this.memberRepository.save(member);
  }

  async findMember(classId: string, userId: string): Promise<ClassMember | null> {
    return this.memberRepository.findOne({
      where: { classId, userId },
    });
  }

  async getMembers(classId: string): Promise<ClassMember[]> {
    return this.memberRepository.find({
      where: { classId },
      relations: ['user'],
      order: { joinedAt: 'ASC' },
    });
  }

  async removeMember(classId: string, userId: string): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: { classId, userId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.memberRepository.remove(member);
    return true;
  }

  async getUserClasses(userId: string): Promise<ClassEntity[]> {
    const memberships = await this.memberRepository.find({
      where: { userId },
    });

    const classIds = memberships.map((m) => m.classId);
    if (classIds.length === 0) return [];

    return this.classRepository
      .createQueryBuilder('class')
      .where('class.id IN (:...classIds)', { classIds })
      .leftJoinAndSelect('class.teacher', 'teacher')
      .orderBy('class.createdAt', 'DESC')
      .getMany();
  }

  // Assignments
  async createAssignment(data: {
    classId: string;
    teacherId: string;
    studySetId: string;
    title?: string;
    description?: string;
    dueDate?: Date;
    dueTime?: string;
    studyMode?: string;
  }): Promise<Assignment> {
    const classEntity = await this.classRepository.findOne({
      where: { id: data.classId },
    });

    if (!classEntity || classEntity.teacherId !== data.teacherId) {
      throw new NotFoundException('Class not found');
    }

    const assignment = this.assignmentRepository.create({
      classId: data.classId,
      studySetId: data.studySetId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      dueTime: data.dueTime,
      studyMode: data.studyMode || 'learn',
    });

    return this.assignmentRepository.save(assignment);
  }

  async getAssignments(classId: string): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      where: { classId },
      order: { dueDate: 'ASC' },
    });
  }

  async getUserAssignments(userId: string): Promise<Assignment[]> {
    const memberships = await this.memberRepository.find({
      where: { userId },
    });

    const classIds = memberships.map((m) => m.classId);
    if (classIds.length === 0) return [];

    return this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.classId IN (:...classIds)', { classIds })
      .orderBy('assignment.dueDate', 'ASC')
      .getMany();
  }

  async updateProgress(
    assignmentId: string,
    userId: string,
    data: {
      status?: string;
      score?: number;
      timeSpentSeconds?: number;
    },
  ): Promise<AssignmentProgress> {
    let progress = await this.progressRepository.findOne({
      where: { assignmentId, userId },
    });

    if (progress) {
      Object.assign(progress, data);
      if (data.status === 'completed') {
        progress.completedAt = new Date();
      }
    } else {
      progress = this.progressRepository.create({
        assignmentId,
        userId,
        ...data,
        status: data.status || 'in_progress',
        startedAt: new Date(),
        attempts: 1,
      });
    }

    return this.progressRepository.save(progress);
  }

  async getProgress(assignmentId: string): Promise<AssignmentProgress[]> {
    return this.progressRepository.find({
      where: { assignmentId },
      relations: ['user'],
    });
  }
}
