# Backend Clean Architecture Specification

## ⚠️ CRITICAL RULE: Dependency Rule

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLEAN ARCHITECTURE DEPENDENCY RULE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PRESENTATION  ──────►  APPLICATION  ──────►  DOMAIN                       │
│       │                      │                      ▲                       │
│       │                      │                      │                       │
│       └──────────────────────┴────────── INFRASTRUCTURE ───────────────────┘
│                                                      │
│  ✅ ALLOWED:                                         │
│  • Presentation → Application                         │
│  • Application → Domain (interfaces)                 │
│  • Infrastructure → Domain (implement interfaces)    │
│                                                                             │
│  ❌ FORBIDDEN:                                       │
│  • Domain → ANYTHING (no TypeORM, no NestJS decorators)                     │
│  • Application → Presentation                        │
│  • Infrastructure → Application                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Layer Structure

### 1. DOMAIN Layer (Pure TypeScript - NO Dependencies)

**Location**: `modules/{feature}/domain/`

**Rules**:
- ❌ NO TypeORM decorators (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`, etc.)
- ❌ NO NestJS decorators (`@Injectable`, `@Inject`, etc.)
- ❌ NO database imports
- ✅ Pure TypeScript classes
- ✅ Business logic lives here
- ✅ Repository INTERFACES only (no implementation)

```
modules/users/
└── domain/
    ├── entities/
    │   ├── user.entity.ts        ← WRONG: contains TypeORM decorators
    │   └── user.ts               ← CORRECT: Pure domain class
    │
    ├── value-objects/
    │   ├── email.vo.ts
    │   ├── password.vo.ts
    │   └── uuid.vo.ts
    │
    ├── repositories/
    │   └── user.repository.interface.ts   ← Interface only
    │
    ├── services/
    │   └── user-domain.service.ts         ← Domain logic only
    │
    └── events/
        └── user-created.event.ts
```

### 2. INFRASTRUCTURE Layer (TypeORM Implementation)

**Location**: `modules/{feature}/infrastructure/`

**Rules**:
- ✅ TypeORM decorators ALLOWED here
- ✅ Implements Domain interfaces
- ✅ Contains Mappers (Domain ↔ Database)
- ❌ NO business logic

```
modules/users/
└── infrastructure/
    ├── persistence/
    │   ├── entities/
    │   │   └── user.entity.ts          ← TypeORM Entity (THIS file)
    │   │
    │   ├── repositories/
    │   │   └── user.repository.ts       ← Implements IUserRepository
    │   │
    │   └── mappers/
    │       └── user.mapper.ts          ← toDomain(), toEntity()
    │
    └── services/
        └── external-api.service.ts
```

### 3. APPLICATION Layer (Use Cases)

**Location**: `modules/{feature}/application/`

**Rules**:
- ✅ Use Cases / Command Handlers
- ✅ Application Services
- ✅ Depends on Domain interfaces (not Infrastructure)
- ✅ Validation logic

```
modules/users/
└── application/
    ├── commands/
    │   ├── create-user/
    │   │   ├── create-user.command.ts
    │   │   └── create-user.handler.ts
    │   │
    │   └── update-user/
    │       ├── update-user.command.ts
    │       └── update-user.handler.ts
    │
    ├── queries/
    │   ├── get-user/
    │   │   ├── get-user.query.ts
    │   │   └── get-user.handler.ts
    │   │
    │   └── list-users/
    │       ├── list-users.query.ts
    │       └── list-users.handler.ts
    │
    └── services/
        └── user.service.ts             ← For simple cases
```

### 4. PRESENTATION Layer (Controllers)

**Location**: `modules/{feature}/presentation/`

**Rules**:
- ✅ HTTP Controllers
- ✅ DTOs (Data Transfer Objects)
- ✅ Request/Response transformation
- ✅ Depends on Application layer

```
modules/users/
└── presentation/
    ├── controllers/
    │   └── users.controller.ts
    │
    ├── dto/
    │   ├── create-user.dto.ts
    │   ├── update-user.dto.ts
    │   └── user-response.dto.ts
    │
    └── users.module.ts                 ← Module wiring
```

---

## 📝 Code Examples

### ❌ WRONG: Domain Entity with TypeORM

```typescript
// modules/users/domain/entities/user.entity.ts  ← WRONG LOCATION
@Entity('users')
@Index('idx_users_email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  // Business logic mixed with database schema
}
```

### ✅ CORRECT: Domain Entity (Pure TypeScript)

```typescript
// modules/users/domain/entities/user.ts
// NO TYPEORM IMPORTS ALLOWED HERE

export type UserRole = 'free' | 'plus' | 'unlimited' | 'teacher';

export interface UserProps {
  email: string;
  passwordHash: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  emailVerifiedAt?: Date;
  isActive: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class User {
  private readonly _id: string;
  private props: UserProps;

  constructor(id: string, props: UserProps) {
    this._id = id;
    this.props = props;
  }

  // Factory
  static create(props: UserProps): User {
    return new User(crypto.randomUUID(), props);
  }

  static fromExisting(id: string, props: UserProps): User {
    return new User(id, props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this.props.email;
  }

  // Business logic
  isTeacher(): boolean {
    return this.props.role === 'teacher';
  }

  isLocked(): boolean {
    return (
      this.props.lockedUntil !== undefined &&
      this.props.lockedUntil > new Date()
    );
  }
}
```

### ✅ CORRECT: Infrastructure Entity (TypeORM)

```typescript
// modules/users/infrastructure/persistence/entities/user.entity.ts
// TypeORM decorators ALLOWED here

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
@Index('idx_users_email', ['email'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'avatar_url' })
  avatarUrl?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({
    type: 'enum',
    enum: ['free', 'plus', 'unlimited', 'teacher'],
    default: 'free',
  })
  role: string;

  @Column({ type: 'timestamp', nullable: true, name: 'email_verified_at' })
  emailVerifiedAt?: Date;

  @Column({ type: 'boolean', default: false, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'integer', default: 0, name: 'failed_login_attempts' })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true, name: 'locked_until' })
  lockedUntil?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
```

### ✅ CORRECT: Repository Interface (Domain)

```typescript
// modules/users/domain/repositories/user.repository.interface.ts

import { User } from '../entities/user';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### ✅ CORRECT: Mapper (Infrastructure)

```typescript
// modules/users/infrastructure/persistence/mappers/user.mapper.ts

import { User, UserProps, UserRole } from '../../../domain/entities/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    const props: UserProps = {
      email: entity.email,
      passwordHash: entity.passwordHash,
      name: entity.name,
      avatarUrl: entity.avatarUrl,
      bio: entity.bio,
      role: entity.role as UserRole,
      emailVerifiedAt: entity.emailVerifiedAt,
      isActive: entity.isActive,
      failedLoginAttempts: entity.failedLoginAttempts,
      lockedUntil: entity.lockedUntil,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };

    return User.fromExisting(entity.id, props);
  }

  static toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.passwordHash = user.props.passwordHash;
    entity.name = user.name;
    entity.avatarUrl = user.props.avatarUrl;
    entity.bio = user.props.bio;
    entity.role = user.props.role;
    entity.emailVerifiedAt = user.props.emailVerifiedAt;
    entity.isActive = user.props.isActive;
    entity.failedLoginAttempts = user.props.failedLoginAttempts;
    entity.lockedUntil = user.props.lockedUntil;
    entity.createdAt = user.props.createdAt;
    entity.updatedAt = user.props.updatedAt;
    entity.deletedAt = user.props.deletedAt;
    return entity;
  }
}
```

### ✅ CORRECT: Repository Implementation (Infrastructure)

```typescript
// modules/users/infrastructure/persistence/repositories/user.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../../domain/entities/user';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { email } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repo.count({ where: { email } });
    return count > 0;
  }

  async save(user: User): Promise<void> {
    const entity = UserMapper.toEntity(user);
    await this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
```

---

## 📁 Complete Module Structure

```
modules/users/
├── domain/
│   ├── entities/
│   │   └── user.ts                    ← Pure TypeScript
│   ├── value-objects/
│   │   ├── email.vo.ts
│   │   └── password.vo.ts
│   ├── repositories/
│   │   └── user.repository.interface.ts
│   ├── services/
│   │   └── user-domain.service.ts
│   └── events/
│       └── user-created.event.ts
│
├── application/
│   ├── commands/
│   │   ├── create-user/
│   │   │   ├── create-user.command.ts
│   │   │   └── create-user.handler.ts
│   │   └── update-user/
│   │       ├── update-user.command.ts
│   │       └── update-user.handler.ts
│   │
│   ├── queries/
│   │   ├── get-user/
│   │   │   ├── get-user.query.ts
│   │   │   └── get-user.handler.ts
│   │   └── list-users/
│   │       ├── list-users.query.ts
│   │       └── list-users.handler.ts
│   │
│   └── services/
│       └── user.service.ts
│
├── infrastructure/
│   ├── persistence/
│   │   ├── entities/
│   │   │   └── user.entity.ts         ← TypeORM Entity
│   │   ├── repositories/
│   │   │   └── user.repository.ts
│   │   └── mappers/
│   │       └── user.mapper.ts
│   │
│   └── services/
│       └── external-api.service.ts
│
└── presentation/
    ├── controllers/
    │   └── users.controller.ts
    │
    ├── dto/
    │   ├── create-user.dto.ts
    │   ├── update-user.dto.ts
    │   └── user-response.dto.ts
    │
    └── users.module.ts
```

---

## 🚨 Migration Guide

### Current Problem

```
modules/users/domain/entities/user.entity.ts
    └── ❌ Contains TypeORM decorators
    └── ❌ Violates Clean Architecture
```

### Solution: Split into Two Files

1. **Create Domain Entity** (no TypeORM):
   - `modules/users/domain/entities/user.ts`

2. **Create Infrastructure Entity** (TypeORM):
   - `modules/users/infrastructure/persistence/entities/user.entity.ts`

3. **Create Mapper**:
   - `modules/users/infrastructure/persistence/mappers/user.mapper.ts`

4. **Update Repository Implementation**:
   - Use mapper in `findById()`, `save()`, etc.

### Affected Modules

| Module | Status | Files to Create/Move |
|--------|--------|---------------------|
| users | ❌ Needs Fix | user.ts, user.entity.ts, user.mapper.ts |
| study-sets | ❌ Needs Fix | study-set.ts, study-set.entity.ts, etc. |
| cards | ❌ Needs Fix | card.ts, card.entity.ts, etc. |
| classes | ❌ Needs Fix | class.ts, class.entity.ts, etc. |
| comments | ❌ Needs Fix | comment.ts, comment.entity.ts, etc. |
| tags | ❌ Needs Fix | tag.ts, tag.entity.ts, etc. |
| auth | ⚠️ Partial | Already has some separation |
| ai | ⚠️ Partial | Already has some separation |
| media | ⚠️ Partial | Already has some separation |
| diagrams | ⚠️ Partial | Already has some separation |
| search | ⚠️ Partial | Already has some separation |
