import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  size: number;
  mimeType: string;
}

@Injectable()
export class MediaService {
  private s3Client: S3Client | null = null;
  private bucket: string;
  private region: string;
  private cdnUrl: string;
  private isConfigured: boolean;

  // Allowed MIME types for uploads
  private readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  private readonly ALLOWED_AUDIO_TYPES = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
  ];

  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  constructor(private config: ConfigService) {
    this.bucket = this.config.get<string>('S3_BUCKET', '');
    this.region = this.config.get<string>('AWS_REGION', 'us-east-1');
    this.cdnUrl = this.config.get<string>('S3_CDN_URL', '');

    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID', '');
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY', '');

    if (accessKeyId && secretAccessKey && this.bucket) {
      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.isConfigured = true;
    } else {
      this.isConfigured = false;
    }
  }

  /**
   * Check if S3 is configured
   */
  isS3Configured(): boolean {
    return this.isConfigured;
  }

  /**
   * Get a pre-signed URL for uploading a file
   */
  async getUploadUrl(
    fileName: string,
    mimeType: string,
    folder: string = 'uploads',
  ): Promise<{ uploadUrl: string; key: string; expiresIn: number }> {
    if (!this.isConfigured) {
      throw new BadRequestException('S3 storage is not configured');
    }

    // Validate file type
    const allowedTypes = [...this.ALLOWED_IMAGE_TYPES, ...this.ALLOWED_AUDIO_TYPES];
    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
      );
    }

    // Generate unique key
    const ext = fileName.split('.').pop() || '';
    const key = `${folder}/${uuidv4()}.${ext}`;

    // Create pre-signed URL (expires in 5 minutes)
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client!, command, {
      expiresIn: 300, // 5 minutes
    });

    return {
      uploadUrl,
      key,
      expiresIn: 300,
    };
  }

  /**
   * Get a pre-signed URL for downloading/viewing a file
   */
  async getDownloadUrl(key: string): Promise<string> {
    if (!this.isConfigured) {
      throw new BadRequestException('S3 storage is not configured');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client!, command, {
      expiresIn: 3600, // 1 hour
    });
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    if (!this.isConfigured) {
      throw new BadRequestException('S3 storage is not configured');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client!.send(command);
  }

  /**
   * Get the public URL for a file (uses CDN if configured)
   */
  getPublicUrl(key: string): string {
    if (this.cdnUrl) {
      return `${this.cdnUrl}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  /**
   * Upload a file directly (for small files or server-side uploads)
   */
  async uploadFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = 'uploads',
  ): Promise<UploadResult> {
    if (!this.isConfigured) {
      throw new BadRequestException('S3 storage is not configured');
    }

    // Validate file size
    if (buffer.length > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File too large. Maximum size: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    // Validate file type
    const allowedTypes = [...this.ALLOWED_IMAGE_TYPES, ...this.ALLOWED_AUDIO_TYPES];
    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
      );
    }

    // Generate unique key
    const ext = fileName.split('.').pop() || '';
    const key = `${folder}/${uuidv4()}.${ext}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.s3Client!.send(command);

    return {
      key,
      url: this.getPublicUrl(key),
      bucket: this.bucket,
      size: buffer.length,
      mimeType,
    };
  }

  /**
   * Validate file type helper
   */
  isImage(mimeType: string): boolean {
    return this.ALLOWED_IMAGE_TYPES.includes(mimeType);
  }

  isAudio(mimeType: string): boolean {
    return this.ALLOWED_AUDIO_TYPES.includes(mimeType);
  }

  /**
   * Get allowed file types
   */
  getAllowedTypes(): { images: string[]; audio: string[] } {
    return {
      images: this.ALLOWED_IMAGE_TYPES,
      audio: this.ALLOWED_AUDIO_TYPES,
    };
  }
}
