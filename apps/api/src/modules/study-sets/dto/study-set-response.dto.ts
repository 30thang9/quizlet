import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StudySetVisibility } from '../entities/study-set.entity';
import { UserSummaryDto } from '../../users/dto';

export class StudySetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional({ type: UserSummaryDto })
  user?: UserSummaryDto;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: StudySetVisibility })
  visibility: StudySetVisibility;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  views: number;

  @ApiProperty()
  cardsCount: number;

  @ApiPropertyOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  lastStudiedAt?: Date;

  @ApiProperty()
  studySessionsCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class StudySetListResponseDto {
  @ApiProperty({ type: [StudySetResponseDto] })
  studySets: StudySetResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}

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

  @ApiPropertyOptional()
  nextReviewAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
