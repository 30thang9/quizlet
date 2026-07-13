import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Classes')
@Controller('classes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new class' })
  async create(@Request() req: any, @Body() dto: CreateClassDto) {
    const classEntity = await this.classesService.create(req.user.id, dto);
    return { success: true, data: classEntity };
  }

  @Get()
  @ApiOperation({ summary: 'Get my classes' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.classesService.findAll(
      req.user.id,
      Number(page),
      Number(limit),
    );
    return {
      success: true,
      data: {
        classes: result.classes,
        total: result.total,
        page: Number(page),
        totalPages: Math.ceil(result.total / Number(limit)),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class by ID' })
  async findOne(@Param('id') id: string) {
    const classEntity = await this.classesService.findById(id);
    return { success: true, data: classEntity };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update class' })
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateClassDto,
  ) {
    const classEntity = await this.classesService.update(id, req.user.id, dto);
    return { success: true, data: classEntity };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete class' })
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.classesService.delete(id, req.user.id);
    return { success: true, message: 'Class deleted successfully' };
  }

  @Post('join/:inviteCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join class by invite code' })
  async joinByInviteCode(@Param('inviteCode') inviteCode: string, @Request() req: any) {
    const member = await this.classesService.joinByInviteCode(inviteCode, req.user.id);
    return { success: true, data: member };
  }

  @Post(':id/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave class' })
  async leave(@Param('id') id: string, @Request() req: any) {
    await this.classesService.leave(id, req.user.id);
    return { success: true, message: 'Left class successfully' };
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get class members' })
  async getMembers(@Param('id') id: string) {
    const members = await this.classesService.getMembers(id);
    return { success: true, data: members };
  }

  @Post(':id/study-sets/:studySetId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add study set to class' })
  async addStudySet(
    @Param('id') id: string,
    @Param('studySetId') studySetId: string,
    @Request() req: any,
  ) {
    const classStudySet = await this.classesService.addStudySet(id, studySetId, req.user.id);
    return { success: true, data: classStudySet };
  }

  @Delete(':id/study-sets/:studySetId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove study set from class' })
  async removeStudySet(
    @Param('id') id: string,
    @Param('studySetId') studySetId: string,
    @Request() req: any,
  ) {
    await this.classesService.removeStudySet(id, studySetId, req.user.id);
    return { success: true, message: 'Study set removed successfully' };
  }

  @Get(':id/study-sets')
  @ApiOperation({ summary: 'Get class study sets' })
  async getStudySets(@Param('id') id: string) {
    const studySets = await this.classesService.getStudySets(id);
    return { success: true, data: studySets };
  }

  @Post(':id/regenerate-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Regenerate invite code' })
  async regenerateInviteCode(@Param('id') id: string, @Request() req: any) {
    const code = await this.classesService.regenerateInviteCode(id, req.user.id);
    return { success: true, data: { inviteCode: code } };
  }
}
