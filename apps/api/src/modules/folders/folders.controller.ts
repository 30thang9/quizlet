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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto, AddStudySetToFolderDto } from './dto';

@ApiTags('Folders')
@Controller('folders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new folder' })
  async create(@Request() req: any, @Body() dto: CreateFolderDto) {
    const folder = await this.foldersService.create(req.user.id, dto);
    return { success: true, data: folder };
  }

  @Get()
  @ApiOperation({ summary: 'Get all folders for current user' })
  async findAll(@Request() req: any) {
    const folders = await this.foldersService.findAll(req.user.id);
    return { success: true, data: folders };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get folder by ID' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    const folder = await this.foldersService.findById(id, req.user.id);
    return { success: true, data: folder };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update folder' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateFolderDto,
  ) {
    const folder = await this.foldersService.update(id, req.user.id, dto);
    return { success: true, data: folder };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete folder' })
  async delete(@Request() req: any, @Param('id') id: string) {
    await this.foldersService.delete(id, req.user.id);
    return { success: true, message: 'Folder deleted successfully' };
  }

  @Get(':id/study-sets')
  @ApiOperation({ summary: 'Get study sets in a folder' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getStudySets(
    @Request() req: any,
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.foldersService.getStudySets(
      id,
      req.user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, data: result };
  }

  @Post(':id/study-sets')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add study set to folder' })
  async addStudySet(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AddStudySetToFolderDto,
  ) {
    const studySet = await this.foldersService.addStudySet(id, dto.studySetId, req.user.id);
    return { success: true, data: studySet };
  }

  @Delete(':id/study-sets/:studySetId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove study set from folder' })
  async removeStudySet(
    @Request() req: any,
    @Param('id') id: string,
    @Param('studySetId') studySetId: string,
  ) {
    const studySet = await this.foldersService.removeStudySet(id, studySetId, req.user.id);
    return { success: true, data: studySet };
  }
}
