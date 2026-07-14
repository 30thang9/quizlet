/**
 * Global TypeScript Declarations
 */

// Extend Window interface for custom properties
interface Window {
  // Analytics
  gtag?: (...args: any[]) => void;
  dataLayer?: any[];
  
  // Auth
  Clerk?: {
    session?: {
      getToken: () => Promise<string | null>;
    };
  };
}

// Environment variables
interface ImportMetaEnv {
  readonly NEXT_PUBLIC_API_URL: string;
  readonly NEXT_PUBLIC_APP_URL: string;
  readonly NEXT_PUBLIC_ENABLE_AI: string;
  readonly NEXT_PUBLIC_ENABLE_DIAGRAMS: string;
  readonly NEXT_PUBLIC_ENABLE_COMMENTS: string;
  readonly NEXT_PUBLIC_ENABLE_CLASSES: string;
  readonly NEXT_PUBLIC_CDN_URL: string;
  readonly NEXT_PUBLIC_S3_BUCKET: string;
  readonly NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
  readonly NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// React children type
declare module 'react' {
  interface ReactNode {
    children?: React.ReactNode;
  }
}

// JSON value types
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

// Utility types
declare type Nullable<T> = T | null;
declare type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Error boundary
declare interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode | ((error: Error, errorInfo: React.ErrorInfo) => React.ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

declare interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Next.js types
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Image imports
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Static file imports
declare module '*?url' {
  const url: string;
  export default url;
}
