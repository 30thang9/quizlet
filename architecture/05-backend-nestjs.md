# 05 - Backend Architecture (NestJS)

## 🎯 Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND TECH STACK                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Framework      │ NestJS 10.x                                  │
│  Language       │ TypeScript 5.x                               │
│  ORM            │ TypeORM / Prisma                              │
│  Database       │ PostgreSQL 16                                 │
│  Cache          │ Redis (ioredis)                               │
│  Validation     │ class-validator + class-transformer           │
│  Logging        │ Winston + ELK Stack                           │
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
│   │   ├── config.interface.ts
│   │   └── configuration.ts
│   │
│   ├── common/                    # Shared utilities
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   │
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── transform.filter.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── throttle.guard.ts
│   │   │
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── cache.interceptor.ts
│   │   │
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   │
│   │   ├── interfaces/
│   │   │   └── pagination.interface.ts
│   │   │
│   │   └── utils/
│   │       └── pagination.ts
│   │
│   ├── modules/                   # Feature modules
│   │   ├── auth/
│   │   │   ├── domain/           # Domain layer
│   │   │   │   ├── entities/
│   │   │   │   └── repositories/
│   │   │   ├── application/       # Application layer
│   │   │   │   ├── commands/
│   │   │   │   ├── queries/
│   │   │   │   └── services/
│   │   │   ├── infrastructure/     # Infrastructure layer
│   │   │   │   └── persistence/
│   │   │   └── presentation/       # Presentation layer
│   │   │       ├── controllers/
│   │   │       ├── dto/
│   │   │       └── auth.module.ts
│   │   │
│   │   ├── users/
│   │   ├── study-sets/
│   │   ├── cards/
│   │   ├── classes/
│   │   ├── assignments/
│   │   ├── progress/
│   │   └── ...
│   │
│   ├── database/                   # Database configuration
│   │   ├── database.module.ts
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   └── shared/                     # Shared from packages
│       ├── types/
│       └── constants/
│
├── test/                           # E2E tests
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## 🏗️ NestJS Module Pattern

### Domain Layer
```typescript
// modules/users/domain/entities/user.entity.ts
import { Entity, UUID } from '@shared/domain';
import { Email } from '@shared/domain/value-objects/email.vo';

export interface UserProps {
  email: Email;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  emailVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum UserRole {
  FREE = 'free',
  PLUS = 'plus',
  UNLIMITED = 'unlimited',
  TEACHER = 'teacher',
}

export class User extends Entity<UUID, UserProps> {
  get email(): Email {
    return this.props.email;
  }
  
  get name(): string {
    return this.props.name;
  }
  
  get role(): UserRole {
    return this.props.role;
  }
  
  isTeacher(): boolean {
    return this.props.role === UserRole.TEACHER;
  }
  
  static create(props: UserProps): User {
    // Business logic
    return new User(new UUID(), props);
  }
}

// modules/users/domain/repositories/user-repository.interface.ts
import { Repository } from '@shared/domain/repository.interface';

export interface IUserRepository extends Repository<User, UUID> {
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
}
```

### Application Layer
```typescript
// modules/users/application/commands/create-user/create-user.command.ts
export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name: string,
  ) {}
}

// modules/users/application/commands/create-user/create-user.handler.ts
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(INJECTIONS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly eventBus: IEventBus,
    private readonly passwordHasher: IPasswordHasher,
  ) {}
  
  async execute(command: CreateUserCommand): Promise<User> {
    // 1. Check if email exists
    const email = Email.create(command.email);
    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      throw new EmailAlreadyExistsException();
    }
    
    // 2. Hash password
    const passwordHash = await this.passwordHasher.hash(command.password);
    
    // 3. Create user
    const user = User.create({
      email,
      passwordHash,
      name: command.name,
      role: UserRole.FREE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // 4. Save
    await this.userRepository.save(user);
    
    // 5. Publish event
    await this.eventBus.publish(new UserCreatedEvent(user));
    
    return user;
  }
}

// modules/users/application/queries/get-user/get-user.query.ts
export class GetUserQuery {
  constructor(public readonly id: string) {}
}

// modules/users/application/queries/get-user/get-user.handler.ts
@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery, User> {
  constructor(
    @Inject(INJECTIONS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}
  
  async execute(query: GetUserQuery): Promise<User> {
    const user = await this.userRepository.findById(new UUID(query.id));
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
```

### Infrastructure Layer
```typescript
// modules/users/infrastructure/persistence/typeorm-user.repository.ts
@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}
  
  async findById(id: UUID): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { id: id.value } });
    return entity ? this.mapper.toDomain(entity) : null;
  }
  
  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { email: email.value } });
    return entity ? this.mapper.toDomain(entity) : null;
  }
  
  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.repo.count({ where: { email: email.value } });
    return count > 0;
  }
  
  async save(user: User): Promise<void> {
    const entity = this.mapper.toEntity(user);
    await this.repo.save(entity);
  }
}

// modules/users/infrastructure/persistence/user.mapper.ts
@Injectable()
export class UserMapper {
  toDomain(entity: UserEntity): User {
    return User.restore(
      new UUID(entity.id),
      {
        email: Email.create(entity.email),
        passwordHash: entity.passwordHash,
        name: entity.name,
        avatarUrl: entity.avatarUrl,
        bio: entity.bio,
        role: entity.role as UserRole,
        emailVerifiedAt: entity.emailVerifiedAt,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
      }
    );
  }
  
  toEntity(user: User): UserEntity {
    return {
      id: user.id.value,
      email: user.email.value,
      passwordHash: user.props.passwordHash,
      name: user.props.name,
      avatarUrl: user.props.avatarUrl,
      bio: user.props.bio,
      role: user.props.role,
      emailVerifiedAt: user.props.emailVerifiedAt,
      createdAt: user.props.createdAt,
      updatedAt: user.props.updatedAt,
      deletedAt: user.props.deletedAt,
    };
  }
}
```

### Presentation Layer
```typescript
// modules/users/presentation/dto/create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password too weak',
  })
  password: string;
  
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;
}

// modules/users/presentation/controllers/users.controller.ts
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly getUserHandler: GetUserHandler,
  ) {}
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const command = new CreateUserCommand(dto.email, dto.password, dto.name);
    const user = await this.createUserHandler.execute(command);
    return this.toResponse(user);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const query = new GetUserQuery(id);
    const user = await this.getUserHandler.execute(query);
    return this.toResponse(user);
  }
  
  private toResponse(user: User): UserResponseDto {
    return {
      id: user.id.value,
      email: user.email.value,
      name: user.name,
      role: user.role,
      avatarUrl: user.props.avatarUrl,
      createdAt: user.props.createdAt,
    };
  }
}
```

### Module Wiring
```typescript
// modules/users/users.module.ts
@Module({
  imports: [
    CqrsModule.registerHandlers([
      CreateUserHandler,
      GetUserHandler,
      UpdateUserHandler,
      DeleteUserHandler,
      // Query handlers...
    ]),
    EventBusModule,
  ],
  controllers: [UsersController],
  providers: [
    // Infrastructure
    TypeOrmUserRepository,
    UserMapper,
    
    // Bind interface to implementation
    {
      provide: INJECTIONS.USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: INJECTIONS.PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [
    UsersService,
    {
      provide: INJECTIONS.USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
})
export class UsersModule {}
```

---

## 🔐 Authentication Module

### JWT Strategy
```typescript
// modules/auth/infrastructure/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }
  
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findById(new UUID(payload.sub));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

// modules/auth/infrastructure/strategies/jwt-auth.guard.ts
export class JwtAuthGuard extends AuthGuard('jwt') {}

// modules/auth/infrastructure/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}
  
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

// Decorators
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
export const Public = () => SetMetadata('isPublic', true);
export const CurrentUser = () => createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
)();
```

---

## 🗄️ Database Module

### TypeORM Configuration
```typescript
// database/database.module.ts
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.database.host,
        port: config.database.port,
        username: config.database.username,
        password: config.database.password,
        database: config.database.name,
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
        logging: config.nodeEnv === 'development',
        ssl: config.nodeEnv === 'production',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

### Migration Example
```typescript
// database/migrations/1700000000001-CreateUsersTable.ts
export class CreateUsersTable1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'role',
            type: 'varchar',
            length: '50',
            default: "'free'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

---

## 🚦 Throttling & Rate Limiting

```typescript
// common/guards/throttle.guard.ts
@Injectable()
export class ThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(
      'Too many requests. Please slow down.',
    );
  }
}

// Usage in controller
@Controller()
@UseGuards(ThrottlerGuard)
export class AuthController {
  @Post('login')
  @Throttle(5, 60) // 5 requests per minute for login
  async login(@Body() dto: LoginDto) {
    // ...
  }
}
```

---

## 📋 Logging

```typescript
// common/interceptors/logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.logger.log(
          `${method} ${url} ${response.statusCode} - ${Date.now() - now}ms`,
        );
      }),
      catchError((error) => {
        this.logger.error(
          `${method} ${url} - Error: ${error.message}`,
          error.stack,
        );
        throw error;
      }),
    );
  }
}
```

---

## 🧪 Testing

### Unit Tests
```typescript
// modules/users/application/__tests__/create-user.handler.spec.ts
describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepository: jest.Mocked<IUserRepository>;
  let eventBus: jest.Mocked<IEventBus>;
  
  beforeEach(() => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: INJECTIONS.USER_REPOSITORY,
          useValue: {
            existsByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: INJECTIONS.EVENT_BUS,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();
    
    handler = module.get(CreateUserHandler);
    userRepository = module.get(INJECTIONS.USER_REPOSITORY);
    eventBus = module.get(INJECTIONS.EVENT_BUS);
  });
  
  it('should create a new user', async () => {
    const command = new CreateUserCommand(
      'test@example.com',
      'Password123!',
      'Test User',
    );
    
    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.save.mockResolvedValue(undefined);
    eventBus.publish.mockResolvedValue(undefined);
    
    const result = await handler.execute(command);
    
    expect(result).toBeInstanceOf(User);
    expect(result.email.value).toBe('test@example.com');
    expect(userRepository.save).toHaveBeenCalled();
  });
  
  it('should throw EmailAlreadyExistsException if email exists', async () => {
    const command = new CreateUserCommand(
      'existing@example.com',
      'Password123!',
      'Test User',
    );
    
    userRepository.existsByEmail.mockResolvedValue(true);
    
    await expect(handler.execute(command)).rejects.toThrow(
      EmailAlreadyExistsException,
    );
  });
});
```

### E2E Tests
```typescript
// test/users.e2e-spec.ts
describe('/users (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = module.createNestApplication();
    await app.init();
    
    // Login to get token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'Password123!' });
    
    accessToken = response.body.data.tokens.accessToken;
  });
  
  it('GET /users/me', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('test@example.com');
  });
});
```

---

## 📚 Swagger/OpenAPI

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Quizlet Clone API')
    .setDescription('API documentation for Quizlet Clone')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('study-sets', 'Study set operations')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
}
```
