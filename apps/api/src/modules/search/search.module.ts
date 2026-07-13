import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './application/search.service';
import { SearchController } from './presentation/controllers/search.controller';
import { StudySet } from '../study-sets/domain/entities/study-set.entity';
import { User } from '../users/domain/entities/user.entity';
import { Tag } from '../tags/domain/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudySet, User, Tag])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
