import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  private supabaseUrl: string | undefined;
  private supabaseKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.supabaseUrl = this.configService.get('SUPABASE_URL');
    this.supabaseKey = this.configService.get('SUPABASE_KEY');
  }

  isS3Configured(): boolean {
    return !!(this.configService.get('AWS_S3_BUCKET') || this.supabaseUrl);
  }

  getAllowedTypes(): string[] {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  }

  async getUploadUrl(
    fileName: string,
    mimeType: string,
    folder: string = 'general',
  ): Promise<{ uploadUrl: string; key: string }> {
    const key = `${folder}/${Date.now()}-${fileName}`;
    return { uploadUrl: `/api/media/upload/${key}`, key };
  }

  async getDownloadUrl(key: string): Promise<string> {
    return `/uploads/${key}`;
  }

  async uploadFile(
    file: any,
    folder: string = 'general',
  ): Promise<{ url: string; key: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const key = `${folder}/${fileName}`;

    return {
      url: `/uploads/${key}`,
      key,
    };
  }

  async deleteFile(key: string): Promise<void> {
    // Implementation depends on storage provider
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    return `/uploads/${key}`;
  }
}
