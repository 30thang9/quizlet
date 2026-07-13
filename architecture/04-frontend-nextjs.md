# 04 - Frontend Architecture (Next.js)

## 🎯 Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND TECH STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Framework      │ Next.js 14 (App Router)                      │
│  Language       │ TypeScript 5.x                               │
│  Styling        │ Tailwind CSS + CSS Modules                    │
│  State          │ Zustand + React Query (TanStack)             │
│  Forms          │ React Hook Form + Zod                        │
│  UI Components  │ shadcn/ui + Radix primitives                 │
│  Animation      │ Framer Motion                                 │
│  Testing        │ Jest + React Testing Library + Playwright     │
│  i18n           │ next-intl                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
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
│   │   ├── (main)/              # Main layout group
│   │   │   ├── layout.tsx       # Main layout with sidebar
│   │   │   ├── dashboard/
│   │   │   ├── library/
│   │   │   ├── sets/
│   │   │   ├── classes/
│   │   │   ├── study/
│   │   │   └── profile/
│   │   │
│   │   ├── (study)/             # Study mode layouts
│   │   │   ├── learn/[setId]/
│   │   │   ├── match/[setId]/
│   │   │   └── test/[setId]/
│   │   │
│   │   ├── (classroom)/         # Teacher layouts
│   │   │   ├── teach/
│   │   │   └── live/
│   │   │
│   │   ├── api/                  # API routes (if needed)
│   │   │
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # Shared components
│   │   ├── ui/                  # Base UI components (shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
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
│   ├── features/                # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── api/
│   │   │
│   │   ├── study-sets/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types/
│   │   │
│   │   ├── study/
│   │   │   ├── learn/
│   │   │   ├── match/
│   │   │   ├── test/
│   │   │   └── ...
│   │   │
│   │   ├── classes/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── ...
│   │   │
│   │   └── ... (other features)
│   │
│   ├── hooks/                    # Global hooks
│   │   ├── use-auth.ts
│   │   ├── use-user.ts
│   │   └── use-toast.ts
│   │
│   ├── lib/                      # Utilities
│   │   ├── api/
│   │   │   ├── client.ts        # Axios/Fetch client
│   │   │   ├── endpoints.ts     # API endpoints
│   │   │   └── types.ts         # API types
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts            # Class name utility
│   │   │   ├── format.ts        # Date, number formatters
│   │   │   └── validation.ts     # Zod schemas
│   │   │
│   │   └── constants.ts
│   │
│   ├── stores/                  # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── ui-store.ts
│   │   └── study-store.ts
│   │
│   └── types/                    # Global types
│       ├── next.d.ts
│       └── global.d.ts
│
├── public/                       # Static assets
├── tests/                        # E2E tests
├── .env.local                   # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🏗️ Feature Module Structure

### Feature-Based Architecture
```
features/
├── study-sets/
│   ├── components/
│   │   ├── StudySetCard.tsx
│   │   ├── StudySetList.tsx
│   │   ├── StudySetForm.tsx
│   │   ├── StudySetDetail.tsx
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useStudySets.ts       # React Query hooks
│   │   ├── useStudySet.ts
│   │   └── useCreateStudySet.ts
│   │
│   ├── api/
│   │   ├── studySets.api.ts      # API functions
│   │   └── studySets.query.ts    # Query keys
│   │
│   ├── types/
│   │   └── study-set.types.ts    # Feature types
│   │
│   ├── constants/
│   │   └── study-sets.constants.ts
│   │
│   └── index.ts                  # Public exports
```

### Barrel Export Pattern
```typescript
// features/study-sets/index.ts
export * from './components';
export * from './hooks';
export * from './types';
```

---

## 🔄 State Management

### 1. Server State (React Query)
```typescript
// lib/api/studySets.api.ts
import { apiClient } from '@/lib/api/client';

export const studySetsApi = {
  getAll: async (params: GetStudySetsParams) => {
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

// lib/api/hooks/useStudySets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studySetsApi } from '../api/studySets.api';

export const studySetKeys = {
  all: ['studySets'] as const,
  lists: () => [...studySetKeys.all, 'list'] as const,
  list: (filters: string) => [...studySetKeys.lists(), { filters }] as const,
  details: () => [...studySetKeys.all, 'detail'] as const,
  detail: (id: string) => [...studySetKeys.details(), id] as const,
};

export const useStudySets = (params: GetStudySetsParams) => {
  return useQuery({
    queryKey: studySetKeys.list(JSON.stringify(params)),
    queryFn: () => studySetsApi.getAll(params),
  });
};

export const useStudySet = (id: string) => {
  return useQuery({
    queryKey: studySetKeys.detail(id),
    queryFn: () => studySetsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateStudySet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studySetsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studySetKeys.lists() });
    },
  });
};
```

### 2. Client State (Zustand)
```typescript
// stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
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
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'system',
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
```

---

## 🎨 Component Patterns

### 1. Compound Components
```typescript
// components/flashcards/flashcard.tsx
interface FlashCardProps {
  term: string;
  definition: string;
  imageUrl?: string;
}

interface FlashCardCompound {
  Front: React.FC<{ children: React.ReactNode }>;
  Back: React.FC<{ children: React.ReactNode }>;
  Actions: React.FC<{ children: React.ReactNode }>;
}

export const FlashCard: React.FC<FlashCardProps> & FlashCardCompound = ({
  term,
  definition,
  imageUrl,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div onClick={() => setIsFlipped(!isFlipped)}>
      {isFlipped ? (
        <div className="flashcard-back">
          <p>{definition}</p>
        </div>
      ) : (
        <div className="flashcard-front">
          <p>{term}</p>
          {imageUrl && <img src={imageUrl} alt="" />}
        </div>
      )}
    </div>
  );
};

FlashCard.Front = ({ children }) => <div className="front">{children}</div>;
FlashCard.Back = ({ children }) => <div className="back">{children}</div>;
FlashCard.Actions = ({ children }) => <div className="actions">{children}</div>;

// Usage
<FlashCard term="Mitochondria" definition="Powerhouse of cell">
  <FlashCard.Actions>
    <Button>Star</Button>
    <Button>Edit</Button>
  </FlashCard.Actions>
</FlashCard>
```

### 2. Slots Pattern (Headless UI)
```typescript
// components/tabs/tabs.tsx
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

interface TabProps {
  value: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> & { Tab: React.FC<TabProps> } = ({
  defaultValue,
  children,
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.Tab = ({ value, children }) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;
  
  return (
    <button
      className={cn('tab', isActive && 'active')}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};
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
});

export const createCardSchema = z.object({
  term: z.string().min(1, 'Term is required'),
  definition: z.string().min(1, 'Definition is required'),
  imageUrl: z.string().url().optional().nullable(),
  audioUrl: z.string().url().optional().nullable(),
});

export type CreateStudySetInput = z.infer<typeof createStudySetSchema>;

// components/forms/StudySetForm.tsx
export const StudySetForm: React.FC<StudySetFormProps> = ({ onSubmit }) => {
  const form = useForm<CreateStudySetInput>({
    resolver: zodResolver(createStudySetSchema),
    defaultValues: {
      visibility: 'public',
    },
  });
  
  const handleSubmit = async (data: CreateStudySetInput) => {
    try {
      await onSubmit(data);
      toast.success('Study set created successfully!');
    } catch (error) {
      toast.error('Failed to create study set');
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields... */}
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
};
```

---

## 🧪 Testing Strategy

### 1. Unit Tests (Jest + RTL)
```typescript
// features/study-sets/__tests__/useStudySets.test.ts
describe('useStudySets', () => {
  it('should return study sets', async () => {
    const { result } = renderHook(() => useStudySets({ page: 1 }), {
      wrapper: createQueryClientWrapper(),
    });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.data).toHaveLength(10);
  });
});
```

### 2. Component Tests
```typescript
// components/flashcards/__tests__/FlashCard.test.tsx
describe('FlashCard', () => {
  it('should flip when clicked', async () => {
    render(<FlashCard term="Hello" definition="World" />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(screen.getByText('World')).toBeInTheDocument();
  });
});
```

### 3. E2E Tests (Playwright)
```typescript
// tests/e2e/create-study-set.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Study Set Creation', () => {
  test('should create a new study set', async ({ page }) => {
    await page.goto('/library');
    await page.click('[data-testid="create-set-button"]');
    
    await page.fill('[name="title"]', 'My Study Set');
    await page.fill('[name="description"]', 'Test description');
    
    await page.click('[type="submit"]');
    
    await expect(page.locator('text=My Study Set')).toBeVisible();
  });
});
```

---

## 🚀 Performance Optimizations

### 1. Server Components
```typescript
// app/library/page.tsx (Server Component)
import { getStudySets } from '@/features/study-sets/api/studySets.api';

export default async function LibraryPage() {
  const studySets = await getStudySets({ page: 1 });
  
  return <StudySetList initialData={studySets} />;
}
```

### 2. Suspense Boundaries
```typescript
// app/library/page.tsx
import { Suspense } from 'react';

export default function LibraryPage() {
  return (
    <div>
      <h1>My Library</h1>
      
      <Suspense fallback={<StudySetListSkeleton />}>
        <StudySetList />
      </Suspense>
    </div>
  );
}
```

### 3. Image Optimization
```typescript
// Using Next.js Image component
import Image from 'next/image';

<Image
  src={card.imageUrl}
  alt={card.term}
  width={300}
  height={200}
  placeholder="blur"
  blurDataURL={card.blurHash}
/>
```

---

## 🔐 Authentication Flow

### Next-Auth Integration
```typescript
// lib/auth/config.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/features/auth/api';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await login(credentials.email, credentials.password);
        if (user) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

// app/api/auth/[...nextauth]/route.ts
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 🌐 Internationalization

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'vi', 'es', 'fr'],
  defaultLocale: 'en',
});

export const config = {
  matcher: ['/', '/(en|vi|es|fr)/:path*'],
};

// messages/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "auth": {
    "login": "Log in",
    "register": "Sign up"
  },
  "studySets": {
    "title": "Study Sets",
    "create": "Create New Set"
  }
}
```
