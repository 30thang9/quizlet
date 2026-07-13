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
import { AuthGuard } from '@nestjs/passport';
import { MediaService } from './application/media.service';

class GetUploadUrlDto {
  fileName: string;
  mimeType: string;
  folder?: string;
}

class DeleteFileDto {
  key: string;
}

@Controller('media')
@UseGuards(AuthGuard('jwt'))
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-url')
  @HttpCode(HttpStatus.OK)
  async getUploadUrl(
    @Body() dto: GetUploadUrlDto,
    @Request() req: any,
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
    @Request() req: any,
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
    @Request() req: any,
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
  async getConfig(@Request() req: any) {
    const allowedTypes = this.mediaService.getAllowedTypes();

    return {
      success: true,
      configured: this.mediaService.isS3Configured(),
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes,
    };
  }
}
