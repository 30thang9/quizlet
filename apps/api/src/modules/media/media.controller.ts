import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class GetUploadUrlDto {
  fileName: string;
  mimeType: string;
  folder?: string;
}

class DeleteFileDto {
  key: string;
}

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-url')
  @HttpCode(HttpStatus.OK)
  async getUploadUrl(
    @Body() dto: GetUploadUrlDto,
    @Request() _req: any,
  ) {
    // Check if S3 is configured
    if (!this.mediaService.isS3Configured()) {
      return {
        success: false,
        message: 'S3 storage is not configured',
        configured: false,
      };
    }

    const result = await this.mediaService.getUploadUrl(
      dto.fileName,
      dto.mimeType,
      dto.folder,
    );

    return {
      success: true,
      ...result,
    };
  }

  @Get('download-url/:key(*.+)')
  async getDownloadUrl(
    @Param('key') key: string,
    @Request() _req: any,
  ) {
    if (!this.mediaService.isS3Configured()) {
      return {
        success: false,
        message: 'S3 storage is not configured',
      };
    }

    const url = await this.mediaService.getDownloadUrl(decodeURIComponent(key));

    return {
      success: true,
      url,
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteFile(
    @Body() dto: DeleteFileDto,
    @Request() _req: any,
  ) {
    if (!this.mediaService.isS3Configured()) {
      return {
        success: false,
        message: 'S3 storage is not configured',
      };
    }

    await this.mediaService.deleteFile(dto.key);

    return {
      success: true,
      message: 'File deleted successfully',
    };
  }

  @Get('config')
  async getConfig(@Request() _req: any) {
    const allowedTypes = this.mediaService.getAllowedTypes();

    return {
      success: true,
      configured: this.mediaService.isS3Configured(),
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes,
    };
  }
}
