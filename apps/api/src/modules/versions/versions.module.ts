import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionsService } from './application/versions.service';
import { VersionsController, VersionActionsController } from './presentation/controllers/versions.controller';
import { StudySetVersion } from './domain/entities/study-set-version.entity';
import { StudySet } from '../study-sets/domain/entities/study-set.entity';
import { Card } from '../cards/domain/entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudySetVersion, StudySet, Card])],
  controllers: [VersionsController, VersionActionsController],
  providers: [VersionsService],
  exports: [VersionsService],
})
export class VersionsModule {}
