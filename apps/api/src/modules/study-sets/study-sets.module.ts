import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudySetsController } from './study-sets.controller';
import { StudySetsService } from './study-sets.service';
import { StudySet } from './entities/study-set.entity';
import { Card } from './entities/card.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudySet, Card]),
    forwardRef(() => AuthModule),
  ],
  controllers: [StudySetsController],
  providers: [StudySetsService],
  exports: [StudySetsService],
})
export class StudySetsModule {}
