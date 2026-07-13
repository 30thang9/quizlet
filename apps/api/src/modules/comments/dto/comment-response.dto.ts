import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentableType } from '../entities/comment.entity';
import { UserSummaryDto } from '../../users/dto';

export class CommentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional({ type: UserSummaryDto })
  user?: UserSummaryDto;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiProperty({ enum: CommentableType })
  type: CommentableType;

  @ApiPropertyOptional()
  studySetId?: string;

  @ApiPropertyOptional()
  cardId?: string;

  @ApiPropertyOptional()
  classId?: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isEdited: boolean;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  repliesCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CommentListResponseDto {
  @ApiProperty({ type: [CommentResponseDto] })
  comments: CommentResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}
