// Configuration constants

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1',
  TIMEOUT: parseInt(process.env.API_TIMEOUT || '30000', 10),
  RETRY_ATTEMPTS: 3,
} as const;

export const AUTH_CONFIG = {
  TOKEN_KEY: process.env.AUTH_TOKEN_KEY || 'accessToken',
  REFRESH_TOKEN_KEY: process.env.AUTH_REFRESH_KEY || 'refreshToken',
  USER_KEY: 'currentUser',
} as const;

export const CARD_STUDY_CONFIG = {
  MIN_CARDS_FOR_MATCH: 4,
  MAX_CARDS_PER_SESSION: parseInt(process.env.MAX_CARDS_PER_SET || '100', 10),
  DEFAULT_QUESTION_COUNT: 10,
  DEFAULT_TIME_LIMIT: 0,
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
} as const;

export const FEATURE_FLAGS = {
  AI: process.env.NEXT_PUBLIC_ENABLE_AI === 'true',
  DIAGRAMS: process.env.NEXT_PUBLIC_ENABLE_DIAGRAMS === 'true',
  COMMENTS: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === 'true',
  CLASSES: process.env.NEXT_PUBLIC_ENABLE_CLASSES === 'true',
} as const;

export const STORAGE_CONFIG = {
  CDN_URL: process.env.NEXT_PUBLIC_CDN_URL || '',
  S3_BUCKET: process.env.NEXT_PUBLIC_S3_BUCKET || 'quizlet-media',
  CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
} as const;
