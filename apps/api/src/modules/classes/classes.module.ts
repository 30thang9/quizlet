import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { Class } from './entities/class.entity';
import { ClassMember } from './entities/class-member.entity';
import { ClassStudySet } from './entities/class-study-set.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, ClassMember, ClassStudySet])],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
