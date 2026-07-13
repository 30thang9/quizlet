import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudySetEntity } from './infrastructure/persistence/entities/study-set.entity';
import { CardEntity } from '../cards/domain/entities/card.entity';
import { StudySetsService, IStudySetsRepository, ICardsRepository } from './application/study-sets.service';
import { StudySetsRepository } from './infrastructure/persistence/study-sets.repository';
import { CardsRepository } from './infrastructure/persistence/cards.repository';
import { StudySetsController } from './presentation/controllers/study-sets.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudySetEntity, CardEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [StudySetsController],
  providers: [
    StudySetsService,
    StudySetsRepository,
    CardsRepository,
    {
      provide: IStudySetsRepository,
      useClass: StudySetsRepository,
    },
    {
      provide: ICardsRepository,
      useClass: CardsRepository,
    },
  ],
  exports: [StudySetsService, IStudySetsRepository, ICardsRepository],
})
export class StudySetsModule {}
