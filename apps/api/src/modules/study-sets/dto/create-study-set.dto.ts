import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StudySetVisibility } from '../entities/study-set.entity';

export class CreateCardDto {
  @ApiProperty({ example: 'What is NestJS?' })
  @IsString()
  term: string;

  @ApiProperty({ example: 'A progressive Node.js framework' })
  @IsString()
  definition: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/audio.mp3' })
  @IsString()
  @IsOptional()
  audioUrl?: string;
}

export class CreateStudySetDto {
  @ApiProperty({ example: 'NestJS Fundamentals', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Learn the basics of NestJS framework' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: StudySetVisibility, default: StudySetVisibility.PRIVATE })
  @IsEnum(StudySetVisibility)
  @IsOptional()
  visibility?: StudySetVisibility;

  @ApiPropertyOptional({ type: [CreateCardDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  @IsOptional()
  cards?: CreateCardDto[];

  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.jpg' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}
