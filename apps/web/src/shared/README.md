# Shared Module

This module contains all reusable code across the application.

## Structure

### Components

- `ui/` - Base UI components (shadcn/ui based)
- `layout/` - Layout components (Header, Footer, Sidebar, etc.)
- `form/` - Form components and patterns
- `table/` - Table and data grid components
- `modal/` - Modal and dialog components
- `chart/` - Chart and visualization components
- `feedback/` - Feedback components (toast, alerts, etc.)

### Utilities

- `hooks/` - Shared custom React hooks
- `lib/` - Shared libraries and configurations
- `utils/` - Utility functions
- `constants/` - Application constants
- `types/` - Shared TypeScript types
- `schemas/` - Shared Zod schemas
- `validators/` - Validation functions

### State & Config

- `providers/` - React context providers
- `config/` - Application configuration
- `permissions/` - Permission definitions
- `stores/` - Global state stores
- `queries/` - Shared TanStack Query hooks
- `mutations/` - Shared TanStack Mutation hooks

### Services

- `services/` - Shared API services

## Usage

```typescript
import { Button } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks';
import { cn } from '@/shared/utils';
```
