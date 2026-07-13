import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TagResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  color: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiProperty()
  studySetsCount: number;

  @ApiProperty()
  usageCount: number;

  @ApiProperty()
  createdAt: Date;
}

export class TagListResponseDto {
  @ApiProperty({ type: [TagResponseDto] })
  tags: TagResponseDto[];

  @ApiProperty()
  total: number;
}
