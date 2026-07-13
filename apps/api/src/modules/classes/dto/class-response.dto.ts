import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassRole } from '../entities/class.entity';
import { UserSummaryDto } from '../../users/dto';

export class ClassResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional({ type: UserSummaryDto })
  user?: UserSummaryDto;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  coverImageUrl?: string;

  @ApiProperty()
  membersCount: number;

  @ApiProperty()
  studySetsCount: number;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  inviteCode?: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ClassMemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  classId: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional({ type: UserSummaryDto })
  user?: UserSummaryDto;

  @ApiProperty({ enum: ClassRole })
  role: ClassRole;

  @ApiPropertyOptional()
  nickname?: string;

  @ApiPropertyOptional()
  joinedAt?: Date;

  @ApiProperty()
  createdAt: Date;
}

export class ClassListResponseDto {
  @ApiProperty({ type: [ClassResponseDto] })
  classes: ClassResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}
