import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VersionsService } from './versions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Versions')
@Controller('versions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Get('study-set/:studySetId')
  @ApiOperation({ summary: 'Get version history for a study set' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByStudySet(
    @Param('studySetId') studySetId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.versionsService.findByStudySet(
      studySetId,
      Number(page),
      Number(limit),
    );
    return {
      success: true,
      data: {
        versions: result.versions,
        total: result.total,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific version' })
  async findOne(@Param('id') id: string) {
    const version = await this.versionsService.findById(id);
    return { success: true, data: version };
  }

  @Get('study-set/:studySetId/latest')
  @ApiOperation({ summary: 'Get latest version of a study set' })
  async getLatestVersion(@Param('studySetId') studySetId: string) {
    const version = await this.versionsService.getLatestVersion(studySetId);
    return { success: true, data: version };
  }

  @Post('study-set/:studySetId/restore/:versionId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Restore study set to a specific version' })
  async restoreVersion(
    @Param('studySetId') studySetId: string,
    @Param('versionId') versionId: string,
    @Request() req: any,
  ) {
    const version = await this.versionsService.restoreVersion(
      versionId,
      req.user.id,
      studySetId,
    );
    return { success: true, data: version };
  }

  @Get('compare/:versionId1/:versionId2')
  @ApiOperation({ summary: 'Compare two versions' })
  async compareVersions(
    @Param('versionId1') versionId1: string,
    @Param('versionId2') versionId2: string,
  ) {
    const result = await this.versionsService.compareVersions(versionId1, versionId2);
    return { success: true, data: result };
  }
}
