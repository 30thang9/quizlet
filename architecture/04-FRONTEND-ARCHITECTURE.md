# Frontend Architecture Specification (Next.js 14)

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         app/ (Next.js App Router)                     │   │
│  │                         Server Components, Pages, Layouts              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         features/                                     │   │
│  │                         Feature-Based Modules                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │  auth    │ │study-sets│ │  classes │ │  study   │ │ profile  │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         components/                                   │   │
│  │                         Shared UI Components                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  │   │
│  │  │    ui/   │ │ layout/  │ │ common/  │ │ flashcards/                │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         lib/ & stores/                                │   │
│  │                         Utilities, API Client, State                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth layout group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── (main)/              # Main authenticated layout
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   ├── library/
│   │   │   ├── sets/
│   │   │   ├── classes/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   │
│   │   ├── (study)/             # Study mode layouts (optional)
│   │   │   ├── learn/[setId]/
│   │   │   ├── match/[setId]/
│   │   │   └── test/[setId]/
│   │   │
│   │   ├── api/                  # API Routes (if needed)
│   │   │
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css
│   │
│   ├── features/                  # Feature-based modules ⭐
│   │   ├── auth/
│   │   ├── study-sets/
│   │   ├── cards/
│   │   ├── classes/
│   │   ├── study/
│   │   ├── progress/
│   │   ├── search/
│   │   ├── notifications/
│   │   └── ...
│   │
│   ├── components/               # Shared UI components
│   │   ├── ui/                  # Base components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── mobile-nav.tsx
│   │   │
│   │   ├── flashcards/           # Flashcard components
│   │   │   ├── flashcard.tsx
│   │   │   ├── flashcard-grid.tsx
│   │   │   └── card-editor.tsx
│   │   │
│   │   └── common/              # Common components
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       └── skeleton.tsx
│   │
│   ├── hooks/                    # Global hooks
│   │   ├── use-auth.ts
│   │   ├── use-user.ts
│   │   └── use-toast.ts
│   │
│   ├── lib/                      # Utilities & API
│   │   ├── api/
│   │   │   ├── client.ts        # Axios/fetch client
│   │   │   ├── endpoints.ts     # API endpoints
│   │   │   └── types.ts        # API response types
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts            # Class name utility
│   │   │   ├── format.ts        # Date, number formatters
│   │   │   └── validation.ts     # Zod schemas
│   │   │
│   │   └── constants.ts
│   │
│   ├── stores/                   # Zustand stores (client state)
│   │   ├── auth-store.ts
│   │   ├── ui-store.ts
│   │   └── study-store.ts
│   │
│   └── types/                    # Global types
│       ├── next.d.ts
│       └── global.d.ts
│
├── public/                        # Static assets
├── tests/                         # E2E tests
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 🏗️ Feature Module Structure

Each feature should be self-contained with all related code:

```
features/study-sets/
├── components/                    # Feature-specific components
│   ├── StudySetCard.tsx
│   ├── StudySetList.tsx
│   ├── StudySetForm.tsx
│   ├── StudySetDetail.tsx
│   ├── CardItem.tsx
│   ├── CardEditor.tsx
│   └── ...
│
├── hooks/                        # Feature hooks (React Query)
│   ├── useStudySets.ts
│   ├── useStudySet.ts
│   ├── useCreateStudySet.ts
│   ├── useUpdateStudySet.ts
│   ├── useDeleteStudySet.ts
│   └── ...
│
├── api/                          # API functions
│   ├── studySets.api.ts         # API calls
│   ├── cards.api.ts
│   └── query-keys.ts            # Query key factory
│
├── types/                        # Feature types
│   ├── study-set.types.ts
│   ├── card.types.ts
│   └── index.ts
│
├── constants/                    # Feature constants
│   └── study-sets.constants.ts
│
└── index.ts                      # Public exports
```

---

## 🔄 State Management

### 1. Server State (React Query / TanStack Query)

**Use for**: Data from API, caching, mutations

```typescript
// features/study-sets/api/studySets.api.ts
import { apiClient } from '@/lib/api/client';
import type { StudySet, CreateStudySetDTO, UpdateStudySetDTO } from '../types';

export const studySetsApi = {
  getAll: async (params?: GetStudySetsParams) => {
    const { data } = await apiClient.get<PaginatedResponse<StudySet>>(
      '/study-sets',
      { params }
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<StudySet>(`/study-sets/${id}`);
    return data;
  },

  create: async (payload: CreateStudySetDTO) => {
    const { data } = await apiClient.post<StudySet>('/study-sets', payload);
    return data;
  },

  update: async (id: string, payload: UpdateStudySetDTO) => {
    const { data } = await apiClient.patch<StudySet>(
      `/study-sets/${id}`,
      payload
    );
    return data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/study-sets/${id}`);
  },
};

// features/study-sets/api/query-keys.ts
export const studySetKeys = {
  all: ['studySets'] as const,
  lists: () => [...studySetKeys.all, 'list'] as const,
  list: (filters: string) => [...studySetKeys.lists(), { filters }] as const,
  details: () => [...studySetKeys.all, 'detail'] as const,
  detail: (id: string) => [...studySetKeys.details(), id] as const,
};

// features/study-sets/hooks/useStudySets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studySetsApi, studySetKeys } from '../api';

export function useStudySets(params?: GetStudySetsParams) {
  return useQuery({
    queryKey: studySetKeys.list(JSON.stringify(params)),
    queryFn: () => studySetsApi.getAll(params),
  });
}

export function useStudySet(id: string) {
  return useQuery({
    queryKey: studySetKeys.detail(id),
    queryFn: () => studySetsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateStudySet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studySetsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studySetKeys.lists() });
      toast.success('Study set created successfully!');
    },
    onError: () => {
      toast.error('Failed to create study set');
    },
  });
}

export function useUpdateStudySet(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudySetDTO) => studySetsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studySetKeys.detail(id) });
      toast.success('Study set updated!');
    },
  });
}

export function useDeleteStudySet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studySetsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studySetKeys.lists() });
      toast.success('Study set deleted');
    },
  });
}
```

### 2. Client State (Zustand)

**Use for**: UI state, auth state, non-persisted state

```typescript
// stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/features/auth/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setAccessToken: (token) => set({ accessToken: token }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// stores/ui-store.ts
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'system',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));
```

---

## 📝 Component Patterns

### 1. Compound Components (FlashCard Example)

```typescript
// components/flashcards/flashcard.tsx
interface FlashCardProps {
  term: string;
  definition: string;
  imageUrl?: string;
  onFlip?: () => void;
}

interface FlashCardCompound {
  (props: FlashCardProps): JSX.Element;
  Front: React.FC<{ children: React.ReactNode }>;
  Back: React.FC<{ children: React.ReactNode }>;
  Actions: React.FC<{ children: React.ReactNode }>;
}

export const FlashCard: FlashCardCompound = ({
  term,
  definition,
  imageUrl,
  onFlip,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  return (
    <div
      className={cn('flashcard', isFlipped && 'flipped')}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <p className="term">{term}</p>
          {imageUrl && <img src={imageUrl} alt="" />}
        </div>
        <div className="flashcard-back">
          <p className="definition">{definition}</p>
        </div>
      </div>
    </div>
  );
};

FlashCard.Front = ({ children }) => (
  <div className="front">{children}</div>
);

FlashCard.Back = ({ children }) => (
  <div className="back">{children}</div>
);

FlashCard.Actions = ({ children }) => (
  <div className="actions">{children}</div>
);
```

### 2. Presentational vs Container Components

```typescript
// features/study-sets/components/StudySetList.tsx (Presentational)
interface StudySetListProps {
  studySets: StudySet[];
  isLoading?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function StudySetList({
  studySets,
  isLoading,
  onSelect,
  onDelete,
}: StudySetListProps) {
  if (isLoading) {
    return <StudySetListSkeleton />;
  }

  if (studySets.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {studySets.map((set) => (
        <StudySetCard
          key={set.id}
          studySet={set}
          onSelect={() => onSelect?.(set.id)}
          onDelete={() => onDelete?.(set.id)}
        />
      ))}
    </div>
  );
}

// features/study-sets/components/StudySetListContainer.tsx (Container)
export function StudySetListContainer() {
  const { data, isLoading } = useStudySets();
  const deleteMutation = useDeleteStudySet();

  const handleDelete = (id: string) => {
    if (confirm('Delete this study set?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <StudySetList
      studySets={data?.data ?? []}
      isLoading={isLoading}
      onDelete={handleDelete}
    />
  );
}
```

---

## 📝 Form Handling

### React Hook Form + Zod

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const createStudySetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private', 'password']),
  password: z.string().optional(),
  language: z.string().optional(),
  subject: z.string().optional(),
}).refine(
  (data) => data.visibility !== 'password' || !!data.password,
  { message: 'Password is required for password-protected sets', path: ['password'] }
);

export const createCardSchema = z.object({
  term: z.string().min(1, 'Term is required'),
  definition: z.string().min(1, 'Definition is required'),
  imageUrl: z.string().url().optional().nullable(),
  audioUrl: z.string().url().optional().nullable(),
});

export type CreateStudySetInput = z.infer<typeof createStudySetSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;

// features/study-sets/components/StudySetForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStudySetSchema, CreateStudySetInput } from '@/lib/validation/schemas';

export function StudySetForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<CreateStudySetInput>({
    resolver: zodResolver(createStudySetSchema),
    defaultValues: {
      visibility: 'public',
    },
  });

  const createMutation = useCreateStudySet();

  const handleSubmit = async (data: CreateStudySetInput) => {
    try {
      await createMutation.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter title..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Optional description..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Create Study Set'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## 🔌 API Client Setup

```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// lib/api/endpoints.ts
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  studySets: {
    base: '/study-sets',
    byId: (id: string) => `/study-sets/${id}`,
    cards: (id: string) => `/study-sets/${id}/cards`,
  },
  classes: {
    base: '/classes',
    byId: (id: string) => `/classes/${id}`,
    members: (id: string) => `/classes/${id}/members`,
  },
} as const;
```

---

## 🚀 Page Patterns

### Server Component Page

```typescript
// app/library/page.tsx (Server Component)
import { getStudySets } from '@/features/study-sets/api/studySets.api';
import { StudySetListContainer } from '@/features/study-sets/components';

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = parseInt(searchParams.page ?? '1', 10);
  const studySets = await getStudySets({ page, search: searchParams.search });

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">My Library</h1>
      <StudySetListContainer />
    </div>
  );
}
```

### Client Component with Suspense

```typescript
// app/library/page.tsx
import { Suspense } from 'react';
import { StudySetListContainer } from '@/features/study-sets/components';
import { StudySetListSkeleton } from '@/components/common';

export default function LibraryPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">My Library</h1>

      <Suspense fallback={<StudySetListSkeleton />}>
        <StudySetListContainer />
      </Suspense>
    </div>
  );
}
```

---

## 📁 Feature Module Example: Auth

```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ForgotPasswordForm.tsx
│   ├── AuthCard.tsx
│   └── SocialButtons.tsx
│
├── hooks/
│   ├── useLogin.ts
│   ├── useRegister.ts
│   ├── useLogout.ts
│   └── useAuth.ts
│
├── api/
│   ├── auth.api.ts
│   └── query-keys.ts
│
├── types/
│   ├── auth.types.ts
│   └── index.ts
│
├── constants/
│   └── auth.constants.ts
│
└── index.ts
```

---

## ✅ Checklist

- [ ] Each feature is self-contained in `features/` folder
- [ ] Feature has: components/, hooks/, api/, types/
- [ ] Server state managed by React Query
- [ ] Client state managed by Zustand
- [ ] Forms use React Hook Form + Zod
- [ ] API client configured with interceptors
- [ ] Shared UI components in `components/ui/`
- [ ] Feature-specific components in `features/{name}/components/`
- [ ] No business logic in components (delegate to hooks)
