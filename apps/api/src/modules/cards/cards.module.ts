import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './domain/entities/card.entity';
import { StudySetsModule } from '../study-sets/study-sets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), StudySetsModule],
  exports: [TypeOrmModule],
})
export class CardsModule {}
