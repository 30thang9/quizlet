import { IsString, IsOptional, MaxLength, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/audio.mp3' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  audioUrl?: string;
}

export class UpdateCardDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  term?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  definition?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  audioUrl?: string;
}

export class ReviewCardDto {
  @ApiProperty({ example: 4, minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  quality: number;
}
