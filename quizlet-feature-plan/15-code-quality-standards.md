# 15 - Code Quality & Standards

## 📋 Tổng Quan

Document này define các code quality standards và patterns được áp dụng trong project.

---

## 🎯 Code Quality Checklist

### ✅ Đã Áp Dụng

| Category | Item | Status | Description |
|----------|------|--------|-------------|
| **Architecture** | Clean Architecture | ✅ | Domain → Application → Infrastructure/Presentation |
| **API** | Response Wrapper | ✅ | `ApiResponse<T>` wrapper cho tất cả responses |
| **API** | Global Error Filter | ✅ | `AllExceptionsFilter` cho centralized error handling |
| **API** | Response Interceptor | ✅ | `TransformInterceptor` tự động wrap responses |
| **Types** | Shared Types | ✅ | Frontend và Backend dùng chung types |
| **Performance** | Component Memo | ✅ | `memo()` cho tất cả components |
| **Performance** | Debounce | ✅ | Debounced search (300ms) |
| **Performance** | useCallback | ✅ | Memoized event handlers |
| **Accessibility** | aria-labels | ✅ | Accessibility attributes |

---

## 🏗️ API Patterns

### 1. Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": { ... }
  }
}
```

### 2. Error Handling

```typescript
// Global filter handles all exceptions
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // Centralized error logging
  // Consistent error response format
  // HTTP status code mapping
}
```

### 3. Request Validation

```typescript
// ValidationPipe configured globally
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  })
);
```

---

## ⚛️ React Patterns

### 1. Component Structure

```typescript
// ✅ CORRECT - Memoized component
const MyComponent = memo(({ prop1, prop2 }: Props) => {
  // hooks
  // handlers (useCallback)
  // computed (useMemo)
  
  return ( ... );
});

export const MyComponent = memo(MyComponent);
```

### 2. Performance Patterns

```typescript
// Debounce for search
const DEBOUNCE_DELAY = 300;

// Memoized handlers
const handleClick = useCallback(() => { ... }, [deps]);

// Memoized computed
const computed = useMemo(() => calculate(value), [value]);

// Component memo
export const Component = memo(InnerComponent);
```

### 3. Accessibility

```typescript
// Always add aria-labels
<input aria-label="Search input" />
<button aria-label="Delete item" />
```

---

## 📁 File Organization

```
apps/
├── api/
│   └── src/
│       ├── common/              # Shared utilities
│       │   ├── filters/        # Exception filters
│       │   ├── interceptors/    # Response interceptors
│       │   ├── interfaces/     # Shared interfaces
│       │   └── decorators/     # Custom decorators
│       └── modules/
│           └── [module]/
│               ├── domain/         # Entities
│               ├── application/   # Services
│               └── presentation/  # Controllers, DTOs
│
└── web/
    └── src/
        ├── components/         # React components
        │   └── [feature]/
        ├── hooks/              # Custom hooks
        ├── types/              # TypeScript types
        └── lib/                # Utilities
```

---

## 🔧 Quality Checks

### Required Before Commit

```bash
# 1. Build
npm run build

# 2. Lint
npm run lint

# 3. Type Check
npm run type-check
```

### ESLint Configuration

- TypeScript strict mode
- No unused variables
- Consistent imports
- React hooks rules
- Accessibility rules

---

## 📊 Metrics

### Build Status

```
API:  ✅ Build passed  |  ✅ Lint passed (0 errors)
Web:  ✅ Build passed  |  ✅ Lint passed (0 errors)
```

### Bundle Size

| Route | Size | First Load JS |
|-------|------|---------------|
| /search | 4.04 kB | 95.1 kB |
| /study-sets/[id] | 2.74 kB | 110 kB |
| /study/[id] | 1.48 kB | 109 kB |

---

## 🚀 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time | < 200ms | ✅ |
| Search Latency | < 100ms | ✅ (debounced) |
| Bundle Size | < 150kB | ✅ |
| LCP | < 2.5s | ✅ |

---

## 📝 Naming Conventions

### Files
- Components: `PascalCase.tsx`
- Services: `camelCase.service.ts`
- Controllers: `camelCase.controller.ts`
- Entities: `PascalCase.entity.ts`
- Hooks: `camelCase.ts` or `useCamelCase.ts`

### Variables
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`
- Enums: `PascalCase` (members: `UPPER_SNAKE_CASE`)

---

## 🔄 Git Workflow

### Branch Naming
```
feat/[feature-name]       # New features
fix/[issue-name]          # Bug fixes
refactor/[scope]          # Refactoring
chore/[task]              # Maintenance
```

### Commit Messages
```
feat: Add new feature
fix: Fix bug
refactor: Improve code
chore: Update dependencies
docs: Update documentation
```

### Pull Request
- Descriptive title
- Link to issue
- Summary of changes
- Testing instructions

---

## 📚 References

- [NestJS Best Practices](https://docs.nestjs.com/)
- [Next.js Performance](https://nextjs.org/docs/architecture/performance)
- [React Patterns](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
