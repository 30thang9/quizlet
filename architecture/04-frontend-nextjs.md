# 04 - Frontend Architecture (Next.js App Router)

## 🎯 Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND TECH STACK                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Framework      │ Next.js 14+ (App Router)                     │
│  Language       │ TypeScript 5.x                               │
│  Styling        │ Tailwind CSS + CSS Modules                   │
│  State          │ React Context + Zustand (optional)           │
│  Forms          │ React Hook Form + Zod                       │
│  Data Fetching  │ Server Components + TanStack Query           │
│  UI Components  │ shadcn/ui (Radix + Tailwind)                │
│  Testing        │ Vitest + React Testing Library + Playwright │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/                        # App Router - Routing only
│   │   ├── (auth)/                 # Route group - Authentication
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (main)/                 # Route group - Main app
│   │   │   ├── (dashboard)/
│   │   │   │   ├── page.tsx        # /dashboard
│   │   │   │   ├── loading.tsx
│   │   │   │   └── _components/    # Route-local components
│   │   │   │
│   │   │   ├── study-sets/
│   │   │   │   ├── page.tsx        # /study-sets
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx    # /study-sets/:id
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── create/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── classes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── study/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx               # Home page (/)
│   │   ├── loading.tsx            # Root loading
│   │   ├── error.tsx              # Root error boundary
│   │   ├── not-found.tsx          # Root 404
│   │   │
│   │   └── api/                    # API routes (BFF pattern)
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       └── proxy/
│   │           └── route.ts
│   │
│   ├── components/                 # Shared UI components
│   │   ├── ui/                    # shadcn/ui atomic components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navbar.tsx
│   │   │
│   │   ├── auth/                  # Auth-related components
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── social-login.tsx
│   │   │
│   │   ├── study/                 # Study-related components
│   │   │   ├── flashcard.tsx
│   │   │   ├── flashcard-deck.tsx
│   │   │   ├── quiz-mode.tsx
│   │   │   └── progress-bar.tsx
│   │   │
│   │   ├── study-sets/            # Study set components
│   │   │   ├── study-set-card.tsx
│   │   │   ├── study-set-grid.tsx
│   │   │   └── card-editor.tsx
│   │   │
│   │   ├── search/                # Search components
│   │   │   ├── search-bar.tsx
│   │   │   └── search-results.tsx
│   │   │
│   │   ├── comments/              # Comment components
│   │   │   ├── comment-list.tsx
│   │   │   ├── comment-item.tsx
│   │   │   └── comment-form.tsx
│   │   │
│   │   ├── tags/                  # Tag components
│   │   │   ├── tag-list.tsx
│   │   │   └── tag-input.tsx
│   │   │
│   │   ├── diagrams/              # Diagram components
│   │   │   └── diagram-viewer.tsx
│   │   │
│   │   ├── media/                 # Media components
│   │   │   ├── image-upload.tsx
│   │   │   └── file-preview.tsx
│   │   │
│   │   └── ai/                    # AI components
│   │       ├── ai-generator.tsx
│   │       └── smart-suggestions.tsx
│   │
│   ├── hooks/                     # Global custom hooks
│   │   ├── index.ts
│   │   ├── useApi.ts              # API fetching hook
│   │   ├── useAuth.ts             # Auth context hook
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── lib/                       # Utilities & configurations
│   │   ├── api/                   # API client
│   │   │   ├── client.ts          # Axios/fetch client
│   │   │   ├── auth.ts            # Auth API
│   │   │   ├── study-sets.ts      # Study sets API
│   │   │   ├── users.ts           # Users API
│   │   │   └── ...
│   │   │
│   │   ├── utils/                 # Utility functions
│   │   │   ├── cn.ts              # classnames utility
│   │   │   ├── formatDate.ts
│   │   │   └── ...
│   │   │
│   │   ├── validations/           # Zod schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── study-set.schema.ts
│   │   │   └── ...
│   │   │
│   │   └── constants.ts
│   │
│   ├── types/                     # Global TypeScript types
│   │   ├── api/                   # API response types
│   │   │   ├── auth.types.ts
│   │   │   ├── study-set.types.ts
│   │   │   └── ...
│   │   │
│   │   ├── index.ts
│   │   └── global.d.ts
│   │
│   ├── providers.tsx              # React providers (optional)
│   └── styles/
│       └── globals.css            # Global styles + Tailwind
│
├── public/                        # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── components.json                # shadcn/ui config
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── vitest.config.ts
└── package.json
```

---

## 🏗️ Key Concepts

### App Router vs Pages Router

```
Pages Router (legacy)          App Router (recommended)
─────────────────────         ───────────────────────
pages/                        app/
├── api/                      ├── page.tsx
├── _app.tsx                  ├── layout.tsx
└── _document.tsx             └── loading.tsx/error.tsx

- Client Components           - Server Components (default)
- getServerSideProps          - async page.tsx
- getStaticProps              - generateStaticParams
```

### Route Groups

```typescript
// (auth)/login/page.tsx     → URL: /login
// (main)/dashboard/page.tsx  → URL: /dashboard

// Route groups don't affect URL
// Used for grouping layouts and shared UI
```

### Server vs Client Components

```typescript
// app/dashboard/page.tsx - Server Component (default)
// No 'use client' directive needed

export default async function DashboardPage() {
  const data = await fetchData(); // Direct DB/API call
  return <div>{data.title}</div>;
}
```

```typescript
// components/counter.tsx - Client Component
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## 📝 Component Patterns

### shadcn/ui Component

```typescript
// components/ui/button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'destructive' && 'bg-destructive text-destructive-foreground',
          // Sizes
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-9 rounded-md px-3',
          size === 'lg' && 'h-11 rounded-md px-8',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export { Button };
```

### Feature Component

```typescript
// components/study-sets/study-set-card.tsx
'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StudySet } from '@/types/api';

interface StudySetCardProps {
  studySet: StudySet;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function StudySetCard({ studySet, onEdit, onDelete }: StudySetCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="font-semibold">{studySet.title}</h3>
        <Badge variant="secondary">{studySet.cardsCount} cards</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {studySet.description}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit?.(studySet.id)}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete?.(studySet.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Layout Component

```typescript
// components/layout/header.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Quizlet Clone
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link href="/study-sets">
            <Button variant="ghost">Study Sets</Button>
          </Link>
          <Link href="/classes">
            <Button variant="ghost">Classes</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

---

## 🎣 Hook Patterns

### API Hook

```typescript
// hooks/useApi.ts
import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T>(apiFunction: () => Promise<T>) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiFunction();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [apiFunction]);

  return { ...state, execute };
}
```

### Auth Hook

```typescript
// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/providers/auth-provider';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}

// Usage
// const { user, login, logout, isLoading } = useAuth();
```

---

## 📡 API Client Pattern

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('accessToken') 
    : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

```typescript
// lib/api/study-sets.ts
import apiClient from './client';
import { StudySet, CreateStudySetDto, UpdateStudySetDto } from '@/types/api';

export const studySetsApi = {
  list: async (params?: { page?: number; limit?: number }) => {
    const { data } = await apiClient.get<{ data: StudySet[]; total: number }>(
      '/study-sets',
      { params }
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<StudySet>(`/study-sets/${id}`);
    return data;
  },

  create: async (dto: CreateStudySetDto) => {
    const { data } = await apiClient.post<StudySet>('/study-sets', dto);
    return data;
  },

  update: async (id: string, dto: UpdateStudySetDto) => {
    const { data } = await apiClient.put<StudySet>(`/study-sets/${id}`, dto);
    return data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/study-sets/${id}`);
  },
};
```

---

## 🧪 Testing Pattern

```typescript
// components/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## ✅ Checklist Khi Tạo Component Mới

### Shared Component (components/)

- [ ] Tạo file trong `components/{feature}/` folder
- [ ] Thêm `'use client'` directive nếu cần interactivity
- [ ] Sử dụng UI components từ `components/ui/`
- [ ] Export component và props interface
- [ ] Viết unit tests trong `__tests__/`

### Page (app/)

- [ ] Tạo folder trong `app/{route}/`
- [ ] Tạo `page.tsx` cho UI
- [ ] Thêm `loading.tsx` cho suspense state (optional)
- [ ] Thêm `error.tsx` cho error boundary (optional)
- [ ] Sử dụng Server Components khi có thể

### API Client (lib/api/)

- [ ] Tạo function trong `lib/api/{resource}.ts`
- [ ] Định nghĩa TypeScript types trong `types/api/`
- [ ] Sử dụng Zod cho runtime validation
- [ ] Handle errors và loading states

### Feature Module

- [ ] Components trong `components/{feature}/`
- [ ] Hooks trong `hooks/` hoặc `components/{feature}/`
- [ ] API functions trong `lib/api/`
- [ ] Types trong `types/api/`
- [ ] Tests trong `__tests__/`

---

## 📚 Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
