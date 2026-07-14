import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum ReviewQuality {
  AGAIN = 0,
  HARD = 1,
  GOOD = 2,
  EASY = 3,
}

export class ReviewCardDto {
  @ApiProperty({ description: 'Card ID to review' })
  @IsString()
  cardId: string;

  @ApiProperty({ description: 'Study session ID', required: false })
  @IsOptional()
  @IsString()
  studySessionId?: string;

  @ApiProperty({ description: 'Review quality: 0=again, 1=hard, 2=good, 3=easy' })
  @IsEnum(ReviewQuality)
  quality: ReviewQuality;

  @ApiPropertyOptional({ description: 'Time spent on this card in seconds' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  timeSpent?: number;
}

export class BulkReviewCardDto {
  @ApiProperty({ description: 'Array of card reviews' })
  @IsString({ each: true })
  cardIds: string[];

  @ApiProperty({ description: 'Study session ID' })
  @IsString()
  studySessionId: string;

  @ApiPropertyOptional({ description: 'Correct count for the session' })
  @IsOptional()
  @IsNumber()
  correctCount?: number;
}
