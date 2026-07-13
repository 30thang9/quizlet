import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ClassesService } from '../../application/classes.service';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  async getUserClasses(@Query('userId') userId: string) {
    return this.classesService.getUserClasses(userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.classesService.findById(id);
  }

  @Post()
  async create(@Body() body: {
    teacherId: string;
    name: string;
    subject?: string;
    gradeLevel?: string;
    description?: string;
  }) {
    return this.classesService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: {
      teacherId: string;
      name?: string;
      subject?: string;
      description?: string;
    },
  ) {
    return this.classesService.update(id, body.teacherId, body);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Body() body: { teacherId: string },
  ) {
    await this.classesService.delete(id, body.teacherId);
    return { success: true };
  }

  @Post('join')
  async joinByCode(@Body() body: { enrollmentCode: string; userId: string }) {
    return this.classesService.joinByCode(body.enrollmentCode, body.userId);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.classesService.getMembers(id);
  }

  @Delete(':id/members/:userId')
  async removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    await this.classesService.removeMember(id, userId);
    return { success: true };
  }

  @Get(':id/assignments')
  async getAssignments(@Param('id') id: string) {
    return this.classesService.getAssignments(id);
  }

  @Post('assignments')
  async createAssignment(@Body() body: {
    classId: string;
    teacherId: string;
    studySetId: string;
    title?: string;
    description?: string;
    dueDate?: string;
    dueTime?: string;
    studyMode?: string;
  }) {
    return this.classesService.createAssignment({
      ...body,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    });
  }

  @Get('assignments/user/:userId')
  async getUserAssignments(@Param('userId') userId: string) {
    return this.classesService.getUserAssignments(userId);
  }

  @Post('assignments/:id/progress')
  async updateProgress(
    @Param('id') id: string,
    @Body() body: {
      userId: string;
      status?: string;
      score?: number;
      timeSpentSeconds?: number;
    },
  ) {
    return this.classesService.updateProgress(id, body.userId, body);
  }

  @Get('assignments/:id/progress')
  async getProgress(@Param('id') id: string) {
    return this.classesService.getProgress(id);
  }
}
