import { z } from 'zod';

// Environment variables schema
const envSchema = z.object({
  // API
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000/v1'),
  API_TIMEOUT: z.string().default('30000'),

  // Auth
  AUTH_TOKEN_KEY: z.string().default('accessToken'),
  AUTH_REFRESH_KEY: z.string().default('refreshToken'),

  // Pagination
  DEFAULT_PAGE_SIZE: z.string().default('20'),
  MAX_PAGE_SIZE: z.string().default('100'),

  // Feature flags
  NEXT_PUBLIC_ENABLE_AI: z.string().default('true'),
  NEXT_PUBLIC_ENABLE_DIAGRAMS: z.string().default('true'),
  NEXT_PUBLIC_ENABLE_COMMENTS: z.string().default('true'),
  NEXT_PUBLIC_ENABLE_CLASSES: z.string().default('true'),

  // Storage
  NEXT_PUBLIC_CDN_URL: z.string().optional(),
  NEXT_PUBLIC_S3_BUCKET: z.string().default('quizlet-media'),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Quizlet'),
});

// Validate environment variables at runtime
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error(
    '❌ Invalid environment variables:',
    parseResult.error.flatten().fieldErrors,
  );
  throw new Error(
    `Invalid environment variables: ${Object.keys(parseResult.error.flatten().fieldErrors || {}).join(', ')}`,
  );
}

// Export typed environment variables
export const env = parseResult.data;

// Type for environment
export type Env = z.infer<typeof envSchema>;
