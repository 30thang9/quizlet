# Quizlet Clone - Technical Architecture
## Senior Technical Architect Design Document

---

## 📋 Tổng Quan

| Item | Value |
|------|-------|
| **Frontend** | Next.js 14 (App Router) + TypeScript |
| **Backend** | NestJS + TypeScript |
| **Database** | PostgreSQL + Redis |
| **Architecture** | Clean Architecture + Hexagonal |
| **Standards** | SOLID, DRY, KISS, GRASP |

---

## 🎯 Thiết Kế Nguyên Tắc

```
┌─────────────────────────────────────────────────────────────────┐
│                    DESIGN PRINCIPLES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SOLID Principles                                               │
│  ├── S - Single Responsibility (mỗi class 1 trách nhiệm)     │
│  ├── O - Open/Closed (mở cho mở rộng, đóng cho sửa)          │
│  ├── L - Liskov Substitution (thay thế không phá vỡ)         │
│  ├── I - Interface Segregation (nhiều interface nhỏ)           │
│  └── D - Dependency Inversion (phụ thuộc abstraction)          │
│                                                                 │
│  Architecture Patterns                                          │
│  ├── Clean Architecture (4 layers)                              │
│  ├── Repository Pattern (trừu tượng data)                     │
│  ├── Unit of Work (transaction)                                │
│  ├── CQRS (Command Query Responsibility Segregation)          │
│  └── Event-Driven (async communication)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu Trúc Repository

```
quizlet/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router (pages)
│   │   │   ├── components/    # UI Components
│   │   │   ├── features/      # Feature-based modules
│   │   │   ├── hooks/         # Custom React Hooks
│   │   │   ├── lib/           # Utilities, configs
│   │   │   ├── services/      # API clients
│   │   │   └── stores/        # State management
│   │   └── ...
│   │
│   └── api/                   # NestJS Backend
│       ├── src/
│       │   ├── modules/       # Feature modules
│       │   ├── common/        # Shared utilities
│       │   ├── config/        # Configuration
│       │   ├── database/      # Database modules
│       │   └── ...
│       └── ...
│
├── packages/
│   ├── shared/                # Shared types, utils
│   ├── ui/                   # Shared UI components
│   └── config/               # Shared configs
│
├── docs/                      # Architecture documents
├── docker/                    # Docker configurations
└── infrastructure/            # Terraform, K8s configs
```

---

## 📄 Các File Kiến Trúc

| File | Mô Tả |
|------|-------|
| `01-clean-architecture.md` | Clean Architecture 4 layers |
| `02-database-design.md` | Database schema & ERD |
| `03-api-design.md` | REST API & GraphQL design |
| `04-frontend-nextjs.md` | Next.js architecture |
| `05-backend-nestjs.md` | NestJS modules & patterns |
| `06-design-patterns.md` | SOLID & patterns implementation |
| `07-security.md` | Authentication & Authorization |
| `08-deployment.md` | Docker & Infrastructure |
