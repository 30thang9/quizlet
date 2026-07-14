/**
 * Application constants
 */

// API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1';
export const API_TIMEOUT = 30000; // 30 seconds

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'quizlet_access_token',
  REFRESH_TOKEN: 'quizlet_refresh_token',
  USER_PREFERENCES: 'quizlet_preferences',
  RECENT_SEARCHES: 'quizlet_recent_searches',
  STUDY_HISTORY: 'quizlet_study_history',
} as const;

// Auth
export const AUTH_CONFIG = {
  TOKEN_KEY: STORAGE_KEYS.ACCESS_TOKEN,
  REFRESH_TOKEN_KEY: STORAGE_KEYS.REFRESH_TOKEN_KEY,
  TOKEN_EXPIRY_BUFFER: 60 * 1000, // 1 minute before actual expiry
} as const;

// Study modes
export const STUDY_MODES = {
  FLASHCARD: 'flashcard',
  LEARN: 'learn',
  TEST: 'test',
  MATCH: 'match',
  WRITE: 'write',
  DIAGRAM: 'diagram',
} as const;

// Visibility options
export const VISIBILITY_OPTIONS = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  LINK: 'link',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const;

// Card limits
export const CARD_LIMITS = {
  MIN_TERM_LENGTH: 1,
  MAX_TERM_LENGTH: 1000,
  MIN_DEFINITION_LENGTH: 1,
  MAX_DEFINITION_LENGTH: 5000,
  MAX_HINT_LENGTH: 500,
  MAX_CARDS_PER_SET: 5000,
  BULK_CREATE_LIMIT: 500,
} as const;

// Study set limits
export const STUDY_SET_LIMITS = {
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_SETS_PER_USER: 10000,
} as const;

// Media limits
export const MEDIA_LIMITS = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_AUDIO_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
} as const;

// Review quality (SM-2)
export const REVIEW_QUALITY = {
  COMPLETE_BLACKOUT: 0,
  INCORRECT: 1,
  INCORRECT_BUT_EASY: 2,
  CORRECT_DIFFICULT: 3,
  CORRECT_HESITATION: 4,
  PERFECT: 5,
} as const;

// Default ease factor (SM-2)
export const SM2_CONFIG = {
  INITIAL_EASE_FACTOR: 2.5,
  MINIMUM_EASE_FACTOR: 1.3,
  EASE_BONUS: 0.1,
  EASE_PENALTY: 0.08,
} as const;

// UI breakpoints (Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Debounce delays
export const DEBOUNCE = {
  SEARCH: 300,
  AUTOSAVE: 1000,
  RESIZE: 250,
} as const;

// Toast durations
export const TOAST = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_AI: process.env.NEXT_PUBLIC_ENABLE_AI === 'true',
  ENABLE_COMMENTS: true,
  ENABLE_DIAGRAMS: true,
  ENABLE_AUDIO: true,
  ENABLE_PDF_IMPORT: true,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  STUDY_SET_CREATED: 'Study set created successfully!',
  STUDY_SET_UPDATED: 'Study set updated successfully!',
  STUDY_SET_DELETED: 'Study set deleted successfully!',
  CARD_CREATED: 'Card created successfully!',
  CARD_UPDATED: 'Card updated successfully!',
  CARD_DELETED: 'Card deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'You have been logged out.',
} as const;
