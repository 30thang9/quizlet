# NestJS Recommended Structure - Theo Official Docs & Best Practices

## 📋 Tổng Quan

Dựa trên **official NestJS documentation**, CLI conventions, và community best practices.

---

## 🏗️ Cấu Trúc NestJS Khuyến Nghị

### 1️⃣ Small-Medium Project (Monolith)

```
src/
├── main.ts
├── app.module.ts
│
├── core/                              # Infrastructure (import 1 lần ở root)
│   ├── core.module.ts
│   ├── config/
│   ├── database/
│   └── auth/
│
├── common/                            # Shared technical components
│   ├── decorators/
│   ├── pipes/
│   ├── filters/
│   ├── interceptors/
│   └── interfaces/
│
└── modules/                           # Feature modules
    ├── users/
    │   ├── users.module.ts           ← ✅ Module file ở ĐÂY
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   ├── dto/
    │   │   ├── create-user.dto.ts
    │   │   └── user-response.dto.ts
    │   ├── entities/
    │   │   └── user.entity.ts
    │   └── users.service.spec.ts
    │
    ├── auth/
    │   └── ...
    │
    └── posts/
        └── ...
```

### 2️⃣ Large Monorepo (Nx/CLI)

```
├── apps/
│   ├── api/                          # Main API
│   ├── admin/                        # Admin panel
│   └── worker/                       # Background jobs
│
├── libs/
│   ├── shared/                       # Shared code
│   │   ├── dto/
│   │   └── interfaces/
│   ├── domain/                       # Shared domain
│   └── infra/                        # Shared infrastructure
│
├── tools/
├── nx.json
└── package.json
```

---

## 📊 So Sánh: NestJS Convention vs Clean Architecture

### ⚠️ ĐIỂM KHÁC BIỆT QUAN TRỌNG

| Aspect | NestJS Convention | Clean Architecture |
|--------|-------------------|-------------------|
| **Module file location** | `modules/{name}/{name}.module.ts` | `modules/{name}/presentation/{name}.module.ts` |
| **Folder structure** | Feature-based (flat) | Layer-based (nested) |
| **Domain layer** | ❌ Không bắt buộc | ✅ Bắt buộc |
| **Pure TypeScript entities** | ❌ Không khuyến nghị | ✅ Bắt buộc |

---

## 🎯 NestJS Official Convention (Khuyến Nghị)

### Module File Location
```
modules/users/
├── users.module.ts        ← ✅ ĐÚNG: Module ở root của feature
├── users.controller.ts
├── users.service.ts
├── dto/
│   ├── create-user.dto.ts
│   └── user-response.dto.ts
├── entities/
│   └── user.entity.ts
└── tests/
    └── users.service.spec.ts
```

### NestJS CLI Generates
```bash
# Tạo feature module
nest g module modules/users
nest g controller modules/users
nest g service modules/users

# Kết quả:
modules/users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
└── users.service.spec.ts
```

---

## 🏛️ Clean Architecture (Nâng Cao - Tùy Chọn)

Nếu project cần **tách biệt hoàn toàn** business logic khỏi framework:

```
modules/users/
├── domain/               ← Pure TypeScript (No NestJS, No TypeORM)
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/    ← Interfaces only
│   ├── services/
│   └── events/
│
├── application/          ← Use Cases (CQRS)
│   ├── commands/
│   ├── queries/
│   └── services/
│
├── infrastructure/      ← Implementations (TypeORM OK)
│   └── persistence/
│       ├── entities/    ← TypeORM Entities
│       ├── repositories/
│       └── mappers/
│
├── users.module.ts       ← Module file ở root (KHÔNG phải presentation/)
├── users.controller.ts
├── users.service.ts
└── dto/
```

### ⚠️ LƯU Ý QUAN TRỌNG

```
❌ SAI: modules/users/presentation/users.module.ts
✅ ĐÚNG: modules/users/users.module.ts
```

Theo NestJS convention, module file luôn nằm ở **root của feature folder**, không phải trong `presentation/`.

---

## 📝 7 Smart Rules (NestJS Best Practices)

### 1️⃣ Feature-Based Modules
```bash
modules/
├── users/        # Tất cả code liên quan đến users ở đây
├── auth/
└── posts/
```

### 2️⃣ Core Module cho Infrastructure
```typescript
// core/core.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({...}),
    TypeOrmModule.forRoot({...}),
    ThrottlerModule.forRoot({...}),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class CoreModule {}
```

### 3️⃣ Common Module cho Shared Utilities
```
common/
├── decorators/
│   └── current-user.decorator.ts
├── pipes/
│   └── parse-int.pipe.ts
├── filters/
│   └── http-exception.filter.ts
└── interceptors/
    └── transform.interceptor.ts
```

### 4️⃣ Module File Đặt Đúng Vị Trí
```typescript
// ✅ ĐÚNG
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
```

### 5️⃣ Keep Controllers Lean
```typescript
// ✅ TỐT
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

### 6️⃣ Services Chứa Business Logic
```typescript
// ✅ TỐT
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    // Business logic ở đây
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email exists');
    return this.repo.save(dto);
  }
}
```

### 7️⃣ DTOs cho Validation
```typescript
// ✅ TỐT
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

---

## 🔧 NestJS CLI Commands

```bash
# Tạo project mới
nest new project-name

# Tạo feature module
nest g module modules/users
nest g controller modules/users
nest g service modules/users

# Tạo resource (tất cả 1 lần)
nest g resource modules/users

# Monorepo
nest g app api
nest g lib libs/shared-dto
```

---

## 📊 Khi Nào Nên Dùng Cấu Trúc Nào?

| Project Size | Recommended | Module Location |
|--------------|-------------|-----------------|
| **Small** (< 5 features) | Feature-based flat | `modules/{name}/{name}.module.ts` |
| **Medium** (5-20 features) | Feature + Core + Common | `modules/{name}/{name}.module.ts` |
| **Large** (20+ features) | Monorepo với libs | `apps/{app}/modules/` |
| **Enterprise** (Multiple apps) | Full Clean Architecture + Nx | `libs/domain/`, `libs/shared/` |

---

## ⚠️ Lưu Ý Quan Trọng

### NestJS Official Convention:
> **"Feature modules should be self-contained and contain all necessary components."**
> Module file đặt ở root của feature folder.

### Clean Architecture (Tùy chọn):
> **"Separate business logic from framework concerns."**
> - Module file có thể đặt trong `presentation/`
> - BẮT BUỘC tách layers
> - Domain entities phải là pure TypeScript

---

## 📚 Nguồn Tham Khảo

1. [NestJS Official Docs - Modules](https://docs.nestjs.com/modules)
2. [NestJS Official Docs - Monorepo](https://docs.nestjs.com/cli/monorepo)
3. [NestJS CLI Overview](https://docs.nestjs.com/cli/overview)
4. [Feature-Based Layout Guide](https://codifysaas.com/blog/saas-architecture/nestjs-project-structure)
5. [NestJS TypeScript Starter](https://github.com/nestjs/typescript-starter)
6. [Monorepo with Nx](https://docs.nestjs.com/recipes/nx)
