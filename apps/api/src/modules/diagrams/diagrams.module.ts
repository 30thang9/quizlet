import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagram, DiagramLabel } from './domain/entities/diagram.entity';
import { DiagramsService } from './application/diagrams.service';
import { DiagramsController } from './presentation/controllers/diagrams.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Diagram, DiagramLabel])],
  controllers: [DiagramsController],
  providers: [DiagramsService],
  exports: [DiagramsService],
})
export class DiagramsModule {}
