# 🔍 Backend API Clean Architecture Review

## 📋 Cấu Trúc Chuẩn (Theo SPEC)

```
modules/users/
├── domain/                          ← PURE TYPESCRIPT (NO dependencies)
│   ├── entities/
│   │   └── user.ts
│   ├── value-objects/              ← ❌ HIỆN TẠI: Thiếu
│   │   ├── email.vo.ts
│   │   └── password.vo.ts
│   ├── repositories/               ← Interface only
│   │   └── user.repository.interface.ts
│   ├── services/                   ← ❌ HIỆN TẠI: Thiếu
│   │   └── user-domain.service.ts
│   └── events/                     ← ❌ HIỆN TẠI: Thiếu
│       └── user-created.event.ts
│
├── application/                    ← USE CASES
│   ├── commands/                   ← ❌ HIỆN TẠI: Thiếu hoàn toàn
│   │   ├── create-user/
│   │   └── update-user/
│   ├── queries/                    ← ❌ HIỆN TẠI: Thiếu hoàn toàn
│   │   ├── get-user/
│   │   └── list-users/
│   └── services/
│       └── user.service.ts         ← ⚠️ Chỉ có Service, chưa có Commands/Queries
│
├── infrastructure/                 ← TYPEORM ALLOWED
│   └── persistence/
│       ├── entities/
│       │   └── user.entity.ts      ← TypeORM Entity
│       ├── repositories/
│       │   └── user.repository.ts
│       └── mappers/
│           └── user.mapper.ts
│
└── presentation/                   ← HTTP LAYER
    ├── controllers/
    │   └── users.controller.ts
    ├── dto/
    │   ├── create-user.dto.ts      ← ❌ HIỆN TẠI: Thiếu
    │   ├── update-user.dto.ts
    │   └── user-response.dto.ts    ← ❌ HIỆN TẠI: Thiếu
    └── users.module.ts             ← ⚠️ ĐANG Ở ROOT - SAI VỊ TRÍ!
```

---

## 📊 Tổng Quan - TẤT CẢ ĐỀU CHƯA ĐÚNG

| Module | Module Location | Domain | Infrastructure | Application | Presentation | Overall |
|--------|---------------|--------|----------------|-------------|--------------|---------|
| **users** | ✅ Presentation | ✅ VO, Services, Events | ✅ | ✅ Commands/Queries | ✅ DTOs | ✅ **ĐÃ REFACTOR** |
| **study-sets** | ❌ Root thay vì presentation | ⚠️ Thiếu VO, Services, Events | ✅ | ⚠️ Thiếu Commands/Queries | ⚠️ Thiếu DTOs | 🔴 |
| **tags** | ❌ Root thay vì presentation | ⚠️ Thiếu đầy đủ | ⚠️ | ⚠️ Thiếu | ⚠️ Thiếu | 🔴 |
| **cards** | ❌ Root thay vì presentation | ❌ TypeORM in Domain | ❌ Thiếu | ❌ Thiếu | ❌ Thiếu | 🔴 |
| **classes** | ❌ Root thay vì presentation | ❌ TypeORM in Domain | ❌ Thiếu | ⚠️ | ⚠️ | 🔴 |
| **comments** | ❌ Root thay vì presentation | ❌ TypeORM in Domain | ❌ Thiếu | ⚠️ | ⚠️ | 🔴 |
| **diagrams** | ❌ Root thay vì presentation | ❌ TypeORM in Domain | ❌ Thiếu | ⚠️ | ⚠️ | 🔴 |
| **versions** | ❌ Root thay vì presentation | ❌ TypeORM in Domain | ❌ Thiếu | ⚠️ | ⚠️ | 🔴 |
| **auth** | ❌ Root thay vì presentation | ❌ Thiếu Domain | ⚠️ | ⚠️ | ⚠️ | 🔴 |
| **ai** | ❌ Root thay vì presentation | ❌ Thiếu Domain | ❌ Thiếu | ⚠️ | ⚠️ | 🔴 |
| **media** | ❌ Root thay vì presentation | ❌ Thiếu Domain | ❌ Thiếu | ⚠️ | ⚠️ Controller ở root | 🔴 |
| **search** | ❌ Root thay vì presentation | ❌ Thiếu Domain | ❌ Thiếu | ⚠️ | ⚠️ | 🔴 |

**Kết luận: Module `users` đã được refactor theo đúng Clean Architecture. 11 modules còn lại cần refactor.**

---

---

## 🔴 TẤT CẢ MODULES ĐỀU CẦN REFACTOR

### Vấn đề CHUNG của tất cả 12 modules:

1. **❌ Module file sai vị trí**: `*.module.ts` đang ở root thay vì `presentation/`
2. **❌ Thiếu Domain Layer đầy đủ**:
   - Thiếu `domain/value-objects/`
   - Thiếu `domain/services/`
   - Thiếu `domain/events/`
3. **❌ Thiếu Application Layer đầy đủ**:
   - Thiếu `application/commands/`
   - Thiếu `application/queries/`
4. **❌ Thiếu Presentation Layer đầy đủ**:
   - Thiếu `presentation/dto/` đầy đủ

---

### Chi tiết từng module:

#### 1. Module `users` - ✅ ĐÃ REFACTOR THÀNH CÔNG

**Đã hoàn thành:**
- ✅ `modules/users/domain/value-objects/` (Email, Password VOs)
- ✅ `modules/users/domain/services/` (UserDomainService)
- ✅ `modules/users/domain/events/` (UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent)
- ✅ `modules/users/application/commands/` (CreateUser, UpdateUser, DeleteUser)
- ✅ `modules/users/application/queries/` (GetUser, ListUsers)
- ✅ `modules/users/presentation/dto/create-user.dto.ts`
- ✅ `modules/users/presentation/dto/user-response.dto.ts`
- ✅ `modules/users/presentation/users.module.ts` (đã di chuyển vào presentation/)
- ✅ `modules/users/injection-tokens.ts` (tách token ra file riêng)

**Cấu trúc hiện tại:**
```
modules/users/
├── domain/
│   ├── entities/
│   │   ├── user.ts              ✅ Pure TypeScript
│   │   └── index.ts
│   ├── value-objects/           ✅
│   │   ├── email.vo.ts
│   │   ├── password.vo.ts
│   │   └── index.ts
│   ├── repositories/
│   │   └── user.repository.interface.ts
│   ├── services/
│   │   ├── user-domain.service.ts
│   │   └── index.ts
│   └── events/                  ✅
│       ├── user-created.event.ts
│       ├── user-updated.event.ts
│       ├── user-deleted.event.ts
│       └── index.ts
├── application/
│   ├── commands/                ✅
│   │   ├── create-user/
│   │   ├── update-user/
│   │   ├── delete-user/
│   │   └── index.ts
│   ├── queries/                 ✅
│   │   ├── get-user/
│   │   ├── list-users/
│   │   └── index.ts
│   └── users.service.ts
├── infrastructure/
│   └── persistence/
│       ├── entities/
│       │   └── user.entity.ts   ✅ TypeORM Entity
│       ├── mappers/
│       │   └── user.mapper.ts
│       └── users.repository.ts
├── presentation/
│   ├── controllers/
│   │   └── users.controller.ts
│   ├── dto/                     ✅
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   ├── user-response.dto.ts
│   │   └── index.ts
│   └── users.module.ts          ✅ ĐÚNG VỊ TRÍ
└── injection-tokens.ts          ✅ Tách riêng
```

---

#### 2. Module `study-sets` - THIẾU NHIỀU THÀNH PHẦN

**Thiếu:**
- `modules/study-sets/domain/value-objects/`
- `modules/study-sets/domain/services/`
- `modules/study-sets/domain/events/`
- `modules/study-sets/application/commands/`
- `modules/study-sets/application/queries/`
- `modules/study-sets/presentation/dto/create-study-set.dto.ts`
- `modules/study-sets/presentation/dto/study-set-response.dto.ts`
- `modules/study-sets/presentation/study-sets.module.ts` (đang ở root)

**Tốt:**
- ✅ Có domain/entity/study-set.ts (Pure TypeScript)
- ✅ Có domain/repositories/study-set.repository.interface.ts
- ✅ Có infrastructure/persistence với Mapper
- ✅ Có presentation/controllers/study-sets.controller.ts

---

#### 3. Module `cards` - VI PHẠM NẶNG NHẤT

**Vấn đề:**
```
apps/api/src/modules/cards/domain/entities/card.entity.ts
```
- ❌ **TypeORM decorators trong Domain Layer** (vi phạm nghiêm trọng)
- ❌ Module file ở root thay vì presentation
- ❌ Không có pure Domain entity
- ❌ Không có Infrastructure layer
- ❌ Không có Presentation layer
- ❌ Không có Application service

**Cần tạo đầy đủ:**
```
modules/cards/
├── domain/
│   ├── entities/
│   │   └── card.ts              ← Pure TypeScript
│   ├── value-objects/
│   ├── repositories/
│   │   └── card.repository.interface.ts
│   ├── services/
│   └── events/
├── application/
│   ├── commands/
│   ├── queries/
│   └── services/
│       └── cards.service.ts
├── infrastructure/
│   └── persistence/
│       ├── entities/
│       │   └── card.entity.ts   ← TypeORM Entity
│       ├── mappers/
│       │   └── card.mapper.ts
│       └── repositories/
│           └── cards.repository.ts
└── presentation/
    ├── controllers/
    │   └── cards.controller.ts
    ├── dto/
    └── cards.module.ts
```

---

#### 4. Module `classes` - VI PHẠM NẶNG + PHỨC TẠP

**Vấn đề:**
```
apps/api/src/modules/classes/domain/entities/class.entity.ts
```
- ❌ **TypeORM decorators trong Domain** (4 entities!)
- ❌ Import User entity từ domain khác vào Domain layer
- ❌ Module file ở root

**4 Entities cần tách:**
1. `Class` → ClassEntity, Class
2. `ClassMember` → ClassMemberEntity, ClassMember
3. `Assignment` → AssignmentEntity, Assignment
4. `AssignmentProgress` → AssignmentProgressEntity, AssignmentProgress

---

#### 5. Module `comments` - VI PHẠM NẶNG

**Vấn đề:**
```
apps/api/src/modules/comments/domain/entities/comment.entity.ts
apps/api/src/modules/comments/domain/entities/comment-like.entity.ts
```
- ❌ TypeORM decorators trong Domain
- ❌ Import User và StudySet từ domain khác
- ❌ Không có đầy đủ 4 layers

---

#### 6. Module `diagrams` - VI PHẠM NẶNG

**Vấn đề:**
```
apps/api/src/modules/diagrams/domain/entities/diagram.entity.ts
```
- ❌ TypeORM decorators trong Domain (2 entities)
- ❌ Thiếu đầy đủ 4 layers

---

#### 7. Module `versions` - VI PHẠM NẶNG

**Vấn đề:**
```
apps/api/src/modules/versions/domain/entities/study-set-version.entity.ts
```
- ❌ TypeORM decorators trong Domain
- ❌ Import User và StudySet từ domain khác

---

#### 8. Module `tags` - CẦN BỔ SUNG

**Thiếu:**
- `modules/tags/domain/` (chỉ có re-export)
- `modules/tags/infrastructure/persistence/mappers/`
- `modules/tags/presentation/dto/`
- `modules/tags/presentation/tags.module.ts`

---

#### 9. Module `auth` - CẦN CẢI TỔ

**Thiếu:**
- `modules/auth/domain/` (hoàn toàn)
- `modules/auth/infrastructure/` (chỉ có guards/strategies)
- `modules/auth/presentation/auth.module.ts` (đang ở root)

---

#### 10. Module `ai` - CẦN CẢI TỔ

**Thiếu:**
- `modules/ai/domain/`
- `modules/ai/infrastructure/`
- `modules/ai/presentation/dto/`
- `modules/ai/presentation/ai.module.ts` (đang ở root)

---

#### 11. Module `media` - CẦN CẢI TỔ

**Vấn đề:**
- ❌ Controller ở root thay vì presentation
- ❌ Không có domain layer
- ❌ Module file ở root

**Cấu trúc hiện tại (sai):**
```
modules/media/
├── media.controller.ts          ← ❌ SAI: ở root
├── media.module.ts             ← ❌ SAI: ở root
└── application/
    └── media.service.ts
```

**Cần đúng:**
```
modules/media/
├── application/
│   └── media.service.ts
├── presentation/               ← ❌ THIẾU
│   ├── controllers/
│   │   └── media.controller.ts
│   ├── dto/
│   └── media.module.ts
└── domain/                      ← ❌ THIẾU (nếu cần)
```

---

#### 12. Module `search` - VI PHẠM DEPENDENCY + CẦU TRÚC

**Vấn đề:**
```
apps/api/src/modules/search/application/search.service.ts
```
- ❌ Import TypeORM entities trực tiếp (`StudySet`, `User`, `Tag`)
- ❌ Sử dụng `@InjectRepository` với TypeORM entities
- ❌ Module file ở root
- ❌ Không có domain layer

---

## 📋 KẾ HOẠCH REFACTOR TOÀN DIỆN

| Phase | Modules | Actions | Files Cần Tạo |
|-------|---------|---------|---------------|
| **Phase 1** | users | Di chuyển module, thêm VO/Services/Events, thêm CQRS | ~15 files |
| **Phase 1** | study-sets | Di chuyển module, thêm VO/Services/Events, thêm CQRS | ~15 files |
| **Phase 2** | cards | Tạo đầy đủ 4 layers từ đầu | ~20 files |
| **Phase 2** | classes | Tạo đầy đủ 4 layers (4 entities) | ~30 files |
| **Phase 3** | comments | Tạo đầy đủ 4 layers | ~15 files |
| **Phase 3** | diagrams | Tạo đầy đủ 4 layers | ~15 files |
| **Phase 3** | versions | Tạo đầy đủ 4 layers | ~15 files |
| **Phase 4** | tags | Bổ sung missing layers | ~10 files |
| **Phase 5** | auth | Tạo domain layer, di chuyển module | ~15 files |
| **Phase 5** | ai | Tạo domain layer, di chuyển module | ~15 files |
| **Phase 5** | media | Di chuyển controller, tạo presentation layer | ~10 files |
| **Phase 5** | search | Tạo domain layer, fix dependency | ~15 files |

**Tổng: ~200 files cần tạo/sửa để tuân thủ hoàn toàn Clean Architecture.**

---

## 🎯 Recommendation Summary

### Immediate Actions Required:

1. **Di chuyển tất cả `*.module.ts`** từ root vào `presentation/`
2. **Tạo `domain/value-objects/`** cho tất cả modules
3. **Tạo `domain/services/`** cho business logic
4. **Tạo `domain/events/`** cho domain events
5. **Tạo `application/commands/` và `application/queries/`** cho CQRS
6. **Bổ sung `presentation/dto/`** đầy đủ
7. **Tách TypeORM entities** ra khỏi domain layer (cards, classes, comments, diagrams, versions)

### Files cần XÓA:
- `modules/*/domain/entities/*.entity.ts` chứa TypeORM decorators
- `modules/*/*.module.ts` ở root

### Files cần TẠO MỚI:
- Domain entities (pure TypeScript)
- Infrastructure entities (TypeORM)
- Mappers
- Commands & Query handlers
- DTOs
- Module files ở vị trí đúng
