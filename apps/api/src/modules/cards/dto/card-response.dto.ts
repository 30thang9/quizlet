import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CardResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  studySetId: string;

  @ApiProperty()
  term: string;

  @ApiProperty()
  definition: string;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  audioUrl?: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  isStarred: boolean;

  @ApiProperty()
  memoryScore: number;

  @ApiProperty()
  easeFactor: number;

  @ApiProperty()
  intervalDays: number;

  @ApiProperty()
  repetitions: number;

  @ApiPropertyOptional()
  nextReviewAt?: Date;

  @ApiPropertyOptional()
  lastReviewedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CardListResponseDto {
  @ApiProperty({ type: [CardResponseDto] })
  cards: CardResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  dueCount: number;
}
