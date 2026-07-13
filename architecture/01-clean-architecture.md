# 01 - Clean Architecture

## 🎯 Tổng Quan

Clean Architecture tách biệt code thành các layers độc lập, giúp:
- **Testability**: Dễ viết unit tests
- **Maintainability**: Dễ maintain, extend
- **Independence**: Không phụ thuộc framework
- **Testability**: Độc lập với database

---

## 🏗️ 4 Layers Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLEAN ARCHITECTURE LAYERS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    PRESENTATION                          │  │
│  │  (Controllers, Resolvers, DTOs, API Endpoints)          │  │
│  │                                                         │  │
│  │  ├── HTTP Controllers (NestJS)                          │  │
│  │  ├── GraphQL Resolvers                                 │  │
│  │  ├── DTOs (Data Transfer Objects)                       │  │
│  │  └── API Validation Pipes                              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    APPLICATION                           │  │
│  │  (Use Cases, Commands, Queries, Event Handlers)          │  │
│  │                                                         │  │
│  │  ├── Command Handlers (Write operations)                │  │
│  │  ├── Query Handlers (Read operations)                  │  │
│  │  ├── Application Services                              │  │
│  │  └── Event Handlers                                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                      DOMAIN                             │  │
│  │  (Entities, Value Objects, Domain Services, Interfaces)  │  │
│  │                                                         │  │
│  │  ├── Entities (User, StudySet, Card, Class)             │  │
│  │  ├── Value Objects (Email, UUID, Money)                 │  │
│  │  ├── Domain Services (SRS Algorithm)                   │  │
│  │  ├── Repository Interfaces                              │  │
│  │  └── Domain Events                                     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  INFRASTRUCTURE                          │  │
│  │  (Repositories, External Services, Frameworks)           │  │
│  │                                                         │  │
│  │  ├── Repository Implementations                         │  │
│  │  ├── Database Mappers                                  │  │
│  │  ├── External API Clients                              │  │
│  │  ├── Caching Services                                  │  │
│  │  └── File Storage                                      │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 NestJS Module Structure

### Domain Layer (Core)
```
src/
├── modules/
│   ├── users/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── email.vo.ts
│   │   │   │   └── password.vo.ts
│   │   │   ├── repositories/
│   │   │   │   └── user-repository.interface.ts
│   │   │   ├── services/
│   │   │   │   └── user-domain.service.ts
│   │   │   └── events/
│   │   │       └── user-created.event.ts
│   │   └── ...
```

### Application Layer
```
│   ├── users/
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── create-user.command.ts
│   │   │   │   └── create-user.handler.ts
│   │   │   ├── queries/
│   │   │   │   ├── get-user.query.ts
│   │   │   │   └── get-user.handler.ts
│   │   │   ├── dtos/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── user-response.dto.ts
│   │   │   └── users.service.ts
```

### Infrastructure Layer
```
│   ├── users/
│   │   └── infrastructure/
│   │       ├── persistence/
│   │       │   ├── user.repository.ts
│   │       │   └── user.mapper.ts
│   │       └── ...
```

### Presentation Layer
```
│   ├── users/
│       └── presentation/
│           ├── users.controller.ts
│           ├── users.resolver.ts (GraphQL)
│           └── users.module.ts
```

---

## 🔄 Dependency Rule

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY RULE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ ALLOWED:                                                    │
│  ├── Presentation → Application                                 │
│  ├── Application → Domain                                        │
│  ├── Application → Domain (via interfaces)                       │
│  └── Infrastructure → Domain (implements interfaces)             │
│                                                                 │
│  ❌ NOT ALLOWED:                                                │
│  ├── Domain → Application                                       │
│  ├── Domain → Infrastructure                                    │
│  ├── Application → Presentation                                 │
│  └── Infrastructure → Application                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💉 Dependency Injection

```typescript
// Domain - Interface (no implementation)
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

// Application - Use Case (depends on interface)
@Injectable()
export class CreateUserCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository, // Interface
    private readonly eventBus: IEventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    // Business logic
    const user = User.create(command.email, command.password);
    await this.userRepository.save(user);
    await this.eventBus.publish(new UserCreatedEvent(user));
    return user;
  }
}

// Infrastructure - Implementation
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private readonly ormRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }
}
```

---

## 🏛️ NestJS Clean Architecture Setup

### 1. Domain Module (Core)
```typescript
// domain/entities/entity.base.ts
export abstract class Entity<T> {
  protected readonly _id: T;
  
  constructor(id: T) {
    this._id = id;
  }
  
  get id(): T {
    return this._id;
  }
  
  equals(entity: Entity<T>): boolean {
    return entity._id === this._id;
  }
}

// domain/repositories/repository.interface.ts
export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### 2. Application Module
```typescript
// application/commands/command.interface.ts
export interface ICommandHandler<T extends ICommand> {
  execute(command: T): Promise<void>;
}

export interface ICommand {}

// application/queries/query.interface.ts
export interface IQueryHandler<T extends IQuery, R> {
  execute(query: T): Promise<R>;
}

export interface IQuery {}
```

### 3. Infrastructure Module
```typescript
// infrastructure/persistence/decorators/inject-repository.ts
export const INJECTIONS = {
  USER_REPOSITORY: 'IUserRepository',
  CARD_REPOSITORY: 'ICardRepository',
  STUDY_SET_REPOSITORY: 'IStudySetRepository',
};
```

### 4. Module Wiring
```typescript
// users.module.ts
@Module({
  imports: [CqrsModule, EventBusModule],
  controllers: [UsersController],
  providers: [
    // Application Services
    UsersService,
    CreateUserCommandHandler,
    GetUserQueryHandler,
    
    // Infrastructure - Bind interface to implementation
    {
      provide: INJECTIONS.USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
```

---

## 📊 CQRS Pattern

### Commands (Write)
```typescript
// Write operations
- CreateStudySetCommand
- UpdateCardCommand
- DeleteStudySetCommand
- AddCardToSetCommand
- EnrollStudentCommand
- CreateAssignmentCommand
```

### Queries (Read)
```typescript
// Read operations (optimized for performance)
- GetStudySetQuery
- GetStudySetsByUserQuery
- GetClassProgressQuery
- GetUserStatisticsQuery
- SearchStudySetsQuery
```

### Separation Benefits
```
┌─────────────────────────────────────────────────────────────────┐
│                    CQRS BENEFITS                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Write Side (Commands):                                         │
│  ├── Complex business logic                                     │
│  ├── Validation & Domain rules                                  │
│  ├── Event publishing                                           │
│  └── Transaction management                                     │
│                                                                 │
│  Read Side (Queries):                                           │
│  ├── Optimized for performance                                  │
│  ├── Denormalized read models                                   │
│  ├── Caching-friendly                                           │
│  └── Projections                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Module Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODULE DEPENDENCIES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Presentation Layer (Controllers)                               │
│       │                                                         │
│       ▼                                                         │
│  Application Layer (Services, Commands, Queries)                │
│       │                                                         │
│       ▼                                                         │
│  Domain Layer (Entities, Interfaces, Value Objects)              │
│       ▲                                                         │
│       │                                                         │
│  Infrastructure (Repositories, External Services)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Best Practices

1. **Domain layer KHÔNG import bất kỳ module nào của NestJS**
2. **Dependency chỉ đi inward** (Presentation → Application → Domain)
3. **Infrastructure implement interfaces từ Domain**
4. **Sử dụng Value Objects cho các giá trị có rules**
5. **Domain Events để decouple modules**
6. **Commands/Queries tách biệt rõ ràng**
