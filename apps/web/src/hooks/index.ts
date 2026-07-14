// API Hooks
export { useApi, apiRequest } from './useApi';
export { useProgress } from './useProgress';
export { useStudySession, type StudyMode, type StudyCard, type StudyState } from './useStudySession';

// Auth Hook
export { useAuth, AuthProvider } from './useAuth.tsx';

// Utility Hooks
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useLocalStorage, useSessionStorage } from './useLocalStorage';
export { 
  useMediaQuery, 
  useIsMobile, 
  useIsTablet, 
  useIsDesktop, 
  useIsLargeDesktop,
  usePrefersReducedMotion,
  usePrefersDarkMode,
  useIsHovering,
} from './useMediaQuery';
