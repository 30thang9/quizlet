import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { UserProgress } from './entities/user-progress.entity';
import { StudySession } from './entities/study-session.entity';
import { Card } from '../study-sets/entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProgress, StudySession, Card])],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
