# 05 - Backend Architecture (NestJS Standard Structure)

## 🎯 Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND TECH STACK                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Framework      │ NestJS 10.x                                  │
│  Language       │ TypeScript 5.x                               │
│  ORM            │ TypeORM                                        │
│  Database       │ PostgreSQL 16                                 │
│  Cache          │ Redis (ioredis)                               │
│  Validation     │ class-validator + class-transformer           │
│  Testing        │ Jest + Supertest                              │
│  API Docs       │ Swagger / OpenAPI                             │
│  Auth           │ Passport.js + JWT                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
apps/api/
├── src/
│   ├── main.ts                    # Application entry
│   ├── app.module.ts              # Root module
│   │
│   ├── config/                    # Configuration
│   │   ├── config.module.ts
│   │   ├── config.service.ts
│   │   └── configuration.ts
│   │
│   ├── common/                    # Shared utilities
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   │
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   │
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   │
│   │   ├── interfaces/
│   │   │   └── pagination.interface.ts
│   │   │
│   │   └── utils/
│   │       └── pagination.ts
│   │
│   ├── modules/                   # Feature modules (NestJS Standard)
│   │   │
│   │   ├── auth/                 # Authentication module
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── index.ts
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── refresh-token.dto.ts
│   │   │   │   └── auth-response.dto.ts
│   │   │   │
│   │   │   ├── guards/
│   │   │   │   ├── index.ts
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   │
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   │
│   │   ├── users/                # Users module
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── index.ts
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── user-response.dto.ts
│   │   │   └── entities/
│   │   │       ├── index.ts
│   │   │       └── user.entity.ts
│   │   │
│   │   ├── study-sets/           # Study Sets module
│   │   │   ├── study-sets.module.ts
│   │   │   ├── study-sets.service.ts
│   │   │   ├── study-sets.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── index.ts
│   │   │   │   ├── create-study-set.dto.ts
│   │   │   │   ├── update-study-set.dto.ts
│   │   │   │   └── study-set-response.dto.ts
│   │   │   └── entities/
│   │   │       ├── index.ts
│   │   │       ├── study-set.entity.ts
│   │   │       └── card.entity.ts
│   │   │
│   │   ├── cards/                # Cards module
│   │   │   ├── cards.module.ts
│   │   │   ├── cards.service.ts
│   │   │   ├── cards.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── index.ts
│   │   │   │   ├── create-card.dto.ts
│   │   │   │   └── card-response.dto.ts
│   │   │   └── entities/
│   │   │       ├── index.ts
│   │   │       └── card.entity.ts
│   │   │
│   │   ├── classes/              # Classes module
│   │   │   ├── classes.module.ts
│   │   │   ├── classes.service.ts
│   │   │   ├── classes.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── index.ts
│   │   │   │   ├── create-class.dto.ts
│   │   │   │   └── class-response.dto.ts
│   │   │   └── entities/
│   │   │       ├── index.ts
│   │   │       ├── class.entity.ts
│   │   │       ├── class-member.entity.ts
│   │   │       └── class-study-set.entity.ts
│   │   │
│   │   ├── comments/             # Comments module
│   │   │   ├── comments.module.ts
│   │   │   ├── comments.service.ts
│   │   │   ├── comments.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── index.ts
│   │   │   │   ├── create-comment.dto.ts
│   │   │   │   └── comment-response.dto.ts
│   │   │   └── entities/
│   │   │       ├── index.ts
│   │   │       ├── comment.entity.ts
│   │   │       └── comment-like.entity.ts
│   │   │
│   │   ├── tags/                 # Tags module
│   │   │   ├── tags.module.ts
│   │   │   ├── tags.service.ts
│   │   │   ├── tags.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── index.ts
│   │   │   │   ├── create-tag.dto.ts
│   │   │   │   └── tag-response.dto.ts
│   │   │   └── entities/
│   │   │       ├── index.ts
│   │   │       ├── tag.entity.ts
│   │   │       └── study-set-tag.entity.ts
│   │   │
│   │   ├── ai/                   # AI module
│   │   │   ├── ai.module.ts
│   │   │   ├── ai.service.ts
│   │   │   └── ai.controller.ts
│   │   │
│   │   ├── media/                # Media module
│   │   │   ├── media.module.ts
│   │   │   ├── media.service.ts
│   │   │   └── media.controller.ts
│   │   │
│   │   ├── search/               # Search module
│   │   │   ├── search.module.ts
│   │   │   ├── search.service.ts
│   │   │   └── search.controller.ts
│   │   │
│   │   ├── diagrams/             # Diagrams module
│   │   │   ├── diagrams.module.ts
│   │   │   ├── diagrams.service.ts
│   │   │   ├── diagrams.controller.ts
│   │   │   └── entities/
│   │   │       └── diagram.entity.ts
│   │   │
│   │   └── versions/             # Versions module
│   │       ├── versions.module.ts
│   │       ├── versions.service.ts
│   │       ├── versions.controller.ts
│   │       └── entities/
│   │           └── study-set-version.entity.ts
│   │
│   └── database/                 # Database configuration
│       └── database.module.ts
│
├── test/                         # E2E tests
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## 🏗️ Module Pattern (NestJS Standard)

### Module Structure Convention

```
modules/{name}/
├── {name}.module.ts         # Module definition
├── {name}.service.ts        # Business logic
├── {name}.controller.ts     # API endpoints
├── dto/                     # Data Transfer Objects
│   ├── index.ts             # Barrel export
│   ├── create-{name}.dto.ts
│   ├── update-{name}.dto.ts
│   └── {name}-response.dto.ts
└── entities/                 # TypeORM Entities
    ├── index.ts             # Barrel export
    └── {name}.entity.ts
```

### Exception: Auth Module

Auth module có cấu trúc đặc biệt với guards và strategies:

```
auth/
├── auth.module.ts
├── auth.service.ts
├── auth.controller.ts
├── dto/
│   └── ...
└── guards/
│   ├── index.ts
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── roles.decorator.ts
└── strategies/
    └── jwt.strategy.ts
```

---

## 📝 Module Examples

### Entity Example

```typescript
// modules/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum UserRole {
  FREE = 'free',
  PLUS = 'plus',
  UNLIMITED = 'unlimited',
  TEACHER = 'teacher',
}

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.FREE,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### DTO Example

```typescript
// modules/users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;
}
```

```typescript
// modules/users/dto/index.ts
export * from './create-user.dto';
export * from './update-user.dto';
export * from './user-response.dto';
```

### Service Example

```typescript
// modules/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create({
      email: dto.email,
      passwordHash: await this.hashPassword(dto.password), // Implement hash
      name: dto.name,
    });

    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }
}
```

### Controller Example

```typescript
// modules/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return { success: true, data: user };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return { success: true, data: user };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    return { success: true, data: user };
  }

  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id);
    return { success: true, data: user };
  }
}
```

### Module Example

```typescript
// modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

## 🔐 Auth Guards

### JWT Auth Guard

```typescript
// modules/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

### Roles Guard

```typescript
// modules/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Roles Decorator

```typescript
// modules/auth/guards/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
export const Public = () => SetMetadata('isPublic', true);
```

---

## 🗄️ Database Configuration

```typescript
// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

---

## 📚 Swagger/OpenAPI

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Quizlet Clone API')
    .setDescription('API documentation for Quizlet Clone')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('study-sets', 'Study set operations')
    .addTag('cards', 'Card operations')
    .addTag('classes', 'Class management')
    .addTag('comments', 'Comments')
    .addTag('tags', 'Tags')
    .addTag('ai', 'AI features')
    .addTag('media', 'Media uploads')
    .addTag('search', 'Search functionality')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}

bootstrap();
```

---

## ✅ Checklist Khi Tạo Module Mới

- [ ] Tạo folder `modules/{name}/`
- [ ] Tạo `{name}.module.ts` với TypeOrmModule.forFeature()
- [ ] Tạo `{name}.service.ts` với @Injectable()
- [ ] Tạo `{name}.controller.ts` với decorators
- [ ] Tạo folder `dto/` với:
  - [ ] `index.ts` (barrel export)
  - [ ] `create-{name}.dto.ts`
  - [ ] `update-{name}.dto.ts`
  - [ ] `{name}-response.dto.ts`
- [ ] Tạo folder `entities/` với:
  - [ ] `index.ts` (barrel export)
  - [ ] `{name}.entity.ts`
- [ ] Import module mới vào `app.module.ts`
- [ ] Thêm Swagger @ApiTags() vào controller
