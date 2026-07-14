# 04 - Frontend Architecture (Next.js App Router)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS + CSS Modules |
| State | React Context + Zustand (optional) |
| Forms | React Hook Form + Zod |
| Data Fetching | Server Components + TanStack Query |
| UI Components | shadcn/ui (Radix + Tailwind) |
| Testing | Vitest + React Testing Library + Playwright |

---

## Project Structure

```
apps/web/
├── public/                          # Static assets (served at root)
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── og-images/
│       └── default-og.png
│
├── src/
│   ├── app/                         # App Router - Routing only
│   │   ├── (auth)/                  # Route group - Authentication
│   │   ├── (main)/                  # Route group - Main app
│   │   └── api/                     # API routes (BFF pattern)
│   │
│   ├── features/                    # Feature-based modules
│   │   ├── auth/
│   │   ├── users/
│   │   ├── study-sets/
│   │   ├── classes/
│   │   ├── study/
│   │   ├── dashboard/
│   │   ├── settings/
│   │   ├── billing/
│   │   ├── notifications/
│   │   ├── search/
│   │   ├── folders/
│   │   ├── ai/
│   │   ├── import/
│   │   └── tags/
│   │   # Each feature has: api/, actions/, components/, hooks/,
│   │   # queries/, mutations/, services/, validators/, schemas/,
│   │   # constants/, permissions/, types/, utils/, store/
│   │
│   ├── shared/                      # Shared/reusable code
│   │   ├── components/ui/          # shadcn/ui atomic components
│   │   ├── components/layout/      # Layout components
│   │   ├── components/form/        # Form components
│   │   ├── hooks/                 # Shared React hooks
│   │   ├── lib/api/                # API client
│   │   ├── utils/                  # Utility functions
│   │   ├── types/                  # TypeScript types
│   │   └── config/                 # Configuration
│   │
│   ├── assets/                      # Processed assets (bundled)
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── svg/
│   │
│   ├── styles/                      # Global styles
│   │   ├── variables.css
│   │   └── tailwind.css
│   │
│   ├── middleware.ts                # Next.js middleware
│   ├── env.ts                       # Environment validation
│   └── instrumentation.ts            # OpenTelemetry setup
```

---

## Static Assets: `public/` vs `src/assets/`

### When to Use `public/`

Files that should be **served directly** at a specific URL path:

```
public/
├── favicon.ico                      # Accessible at /favicon.ico
├── robots.txt                       # Accessible at /robots.txt
├── sitemap.xml                      # Accessible at /sitemap.xml
├── og-images/                       # OG images for social sharing
│   └── default-og.png              # Accessible at /og-images/default-og.png
└── static/                          # Static files for download
    └── sample-deck.pdf
```

**Use cases:**
- Favicon, robots.txt, sitemap
- OG images for meta tags
- Static files that don't change
- Files needed via direct URL (`<img src="/og-images/...">`)

### When to Use `src/assets/`

Files that should be **imported and processed** by the bundler:

```
src/assets/
├── images/                          # Images imported in components
│   ├── logo.png                     # import Logo from '@/assets/images/logo.png'
│   └── patterns/
├── icons/                           # SVG icons as React components
│   ├── CheckIcon.tsx
│   └── CloseIcon.tsx
├── fonts/                           # Custom fonts
│   └── CustomFont.woff2
└── svg/                             # SVG assets
    └── loading-spinner.svg
```

**Use cases:**
- Images used with `next/image` optimization
- Icons imported as React components
- Custom fonts via CSS `@font-face`
- Any asset that needs bundler processing (hashing, optimization)

### Quick Decision Guide

| Question | Answer | Use |
|----------|--------|-----|
| Needs direct URL access? | Yes | `public/` |
| Should be optimized by Next.js? | Yes | `src/assets/` + `next/image` |
| Will be imported in TypeScript? | Yes | `src/assets/` |
| Needs cache busting (hashing)? | Yes | `src/assets/` |
| Static file, never changes? | Yes | `public/` |
| SVG used as React component? | Yes | `src/assets/icons/` |

---

## Feature Module Structure

Each feature is a self-contained module:

```
features/{feature-name}/
├── api/              # API client functions
├── actions/         # Server Actions
├── components/      # Feature-specific components
├── hooks/           # Feature-specific hooks
├── queries/         # TanStack Query definitions
├── mutations/       # TanStack Mutation definitions
├── services/        # Business logic services
├── validators/      # Validation functions
├── schemas/         # Zod schemas
├── constants/       # Feature constants
├── permissions/     # Permission definitions
├── types/           # TypeScript types
├── utils/           # Utility functions
├── store/           # State management (Zustand, etc.)
├── index.ts         # Barrel exports
└── README.md        # Feature documentation
```

---

## Key Patterns

### Route Group Convention

```
app/
├── (auth)/           # No URL prefix - auth routes
│   ├── login/
│   └── register/
├── (main)/           # No URL prefix - main app
│   ├── dashboard/
│   └── settings/
└── (marketing)/      # Optional - marketing pages
    ├── about/
    └── pricing/
```

### Server vs Client Components

```typescript
// app/study-sets/page.tsx - Server Component (default)
// Can fetch data directly, no 'use client' needed

// app/study-sets/study-set-card.tsx - Client Component
'use client';
// Use hooks, event handlers, interactivity
```

### Import Conventions

```typescript
// Shared UI components
import { Button } from '@/shared/components/ui';

// Feature components
import { StudySetCard } from '@/features/study-sets/components';

// Shared utilities
import { cn, formatDate } from '@/shared/utils';

// Shared hooks
import { useDebounce } from '@/shared/hooks';

// Feature hooks
import { useStudySession } from '@/features/study/hooks';
```

---

## Component Classification

### 1. UI Components (`shared/components/ui/`)
Base atomic components from shadcn/ui:
- Button, Input, Card, Dialog, DropdownMenu
- Badge, Avatar, Skeleton
- Form, Label, Textarea

### 2. Layout Components (`shared/components/layout/`)
Global layout elements:
- Header, Footer, Sidebar, Navbar

### 3. Feature Components (`features/*/components/`)
Feature-specific components:
- Flashcard, QuizMode, StudyProgress
- StudySetCard, CardEditor
- SearchBar, SearchResults

### 4. Route Components (`app/**/page.tsx`)
Pages that match routes

---

## Configuration Files

### middleware.ts
Handles authentication guards and redirects.

### env.ts
Type-safe environment variables with Zod validation.

### instrumentation.ts
OpenTelemetry tracing setup.

---

## Checklist When Creating Components

### Shared Component

- [ ] Create file in `shared/components/{category}/`
- [ ] Add `'use client'` directive if needed
- [ ] Use UI components from `shared/components/ui/`
- [ ] Export component and props interface
- [ ] Write unit tests

### Feature Component

- [ ] Create file in `features/{feature}/components/`
- [ ] Follow feature component patterns
- [ ] Import shared utilities
- [ ] Export from feature index.ts

### Page

- [ ] Create folder in `app/{route}/`
- [ ] Create `page.tsx` for UI
- [ ] Add `loading.tsx` for suspense (optional)
- [ ] Add `error.tsx` for error boundary (optional)
- [ ] Prefer Server Components when possible

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
