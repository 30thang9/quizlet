import { IsString, IsOptional, IsUrl, MaxLength, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCardDto {
  @ApiProperty({ example: 'Mitochondria' })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({ example: 'The powerhouse of the cell' })
  @IsString()
  @IsNotEmpty()
  definition: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  audioUrl?: string;
}

export class CreateCardsDto {
  @ApiProperty({ type: [CreateCardDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  cards: CreateCardDto[];
}

export class UpdateCardDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  term?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  definition?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  audioUrl?: string;
}
