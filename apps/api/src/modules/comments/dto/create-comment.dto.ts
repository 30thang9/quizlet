import { IsString, IsOptional, IsEnum, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentableType } from '../entities/comment.entity';

export class CreateCommentDto {
  @ApiProperty({ enum: CommentableType })
  @IsEnum(CommentableType)
  type: CommentableType;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  studySetId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  cardId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  classId?: string;

  @ApiProperty({ example: 'This is a great study set!' })
  @IsString()
  @MaxLength(5000)
  content: string;
}

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  @MaxLength(5000)
  content: string;
}
