# Quizlet Web Application

Enterprise-grade Next.js 15+ application with App Router architecture.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```

## Project Structure

```
apps/web/src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (main)/             # Main application routes
│   └── api/                # BFF API routes
│
├── features/               # Feature-based modules
│   ├── auth/               # Authentication feature
│   ├── users/              # User management
│   ├── study-sets/         # Study sets
│   ├── classes/            # Class management
│   ├── study/              # Study session
│   ├── dashboard/          # Dashboard
│   ├── settings/           # Settings
│   ├── billing/            # Billing
│   ├── notifications/      # Notifications
│   ├── search/             # Search
│   ├── folders/            # Folders
│   ├── ai/                 # AI features
│   ├── import/             # Import
│   └── tags/               # Tags
│
├── shared/                 # Shared/reusable code
│   ├── components/ui/      # shadcn/ui components
│   ├── components/layout/  # Layout components
│   ├── hooks/             # Shared hooks
│   ├── lib/api/           # API client
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   └── config/            # Configuration
│
├── assets/                 # Processed assets
├── styles/                 # Global styles
├── middleware.ts           # Auth middleware
├── env.ts                 # Environment validation
└── instrumentation.ts      # OpenTelemetry
```

## Feature Module Structure

```
features/{feature}/
├── api/            # API client functions
├── actions/        # Server Actions
├── components/     # Feature components
├── hooks/          # Feature hooks
├── queries/        # TanStack Query
├── mutations/       # TanStack Mutations
├── services/       # Business logic
├── schemas/        # Zod schemas
├── types/          # TypeScript types
├── utils/          # Utilities
└── store/          # State management
```

## Key Conventions

### Imports
```typescript
import { Button } from '@/shared/components/ui';
import { cn, formatDate } from '@/shared/utils';
import { useStudySession } from '@/features/study/hooks';
```

### Static Assets
- `public/` - Direct URL access (favicon, og-images)
- `src/assets/` - Bundled assets (processed images, icons)

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/v1
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_DIAGRAMS=true
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS |
| State | React Context + Zustand |
| Forms | React Hook Form + Zod |
| Data Fetching | Server Components + TanStack Query |
| UI | shadcn/ui (Radix + Tailwind) |

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
