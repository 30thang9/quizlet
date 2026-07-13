import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { VersionsService } from '../../application/versions.service';

@Controller('study-sets/:studySetId/versions')
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Get()
  async getVersions(
    @Param('studySetId') studySetId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.versionsService.getVersions(
      studySetId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}

@Controller('versions')
export class VersionActionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Get(':id')
  async getVersion(@Param('id') id: string) {
    return this.versionsService.getVersion(id);
  }

  @Post(':id/restore')
  async restoreVersion(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.versionsService.restoreVersion(id, body.userId);
  }

  @Get(':id1/compare/:id2')
  async compareVersions(
    @Param('id1') id1: string,
    @Param('id2') id2: string,
  ) {
    return this.versionsService.compareVersions(id1, id2);
  }
}
