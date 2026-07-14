'use client';

import { useState, useEffect } from 'react';

interface UseMediaQueryOptions {
  /**
   * If true, the hook will initialize with the default value (false)
   * until the client side hydration is complete
   */
  initializeWithValue?: boolean;
}

/**
 * Hook to react to media query changes
 * @param query - The media query string (e.g., '(min-width: 768px)')
 */
export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {}
): boolean {
  const { initializeWithValue = true } = options;
  
  const [matches, setMatches] = useState<boolean>(
    initializeWithValue ? false : false
  );

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Update state with initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } 
    // Legacy browsers (Safari < 14)
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

// Preset breakpoints (Tailwind CSS default)
export const useIsMobile = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(max-width: 767px)', options);

export const useIsTablet = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(min-width: 768px) and (max-width: 1023px)', options);

export const useIsDesktop = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(min-width: 1024px)', options);

export const useIsLargeDesktop = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(min-width: 1280px)', options);

// Prefers reduced motion
export const usePrefersReducedMotion = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(prefers-reduced-motion: reduce)', options);

// Prefers dark mode
export const usePrefersDarkMode = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(prefers-color-scheme: dark)', options);

// Check if user is hovering (for touch devices)
export const useIsHovering = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(hover: hover) and (pointer: fine)', options);
