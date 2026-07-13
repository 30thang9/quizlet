import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './application/classes.service';
import { ClassesController } from './presentation/controllers/classes.controller';
import {
  ClassEntity,
  ClassMember,
  Assignment,
  AssignmentProgress,
} from './domain/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEntity, ClassMember, Assignment, AssignmentProgress])],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
