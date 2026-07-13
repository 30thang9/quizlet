# 07 - Security Architecture

## 🎯 Security Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔐 Authentication        │ JWT, OAuth 2.0, Social Login      │
│  🔒 Authorization         │ RBAC, Permissions, Resource-based  │
│  🛡️ Data Protection       │ Encryption at rest & in transit    │
│  🚫 Security Headers     │ CORS, CSP, HSTS, etc.               │
│  📊 Monitoring            │ Logging, Alerts, Audit trails       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication

### JWT Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                    JWT AUTHENTICATION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User                    API                    Database       │
│   │                        │                        │            │
│   │── Login (email, pw) ──▶│                        │            │
│   │                        │── Validate ───────────▶│           │
│   │                        │◀── User Data ──────────│           │
│   │                        │                        │            │
│   │◀── Access Token ───────│                        │            │
│   │◀── Refresh Token ──────│                        │            │
│   │                        │                        │            │
│   │── API Request ────────▶│                        │            │
│   │   (with Access Token)  │                        │            │
│   │                        │── Validate JWT ───────▶│           │
│   │◀── Response ───────────│                        │            │
│   │                        │                        │            │
│   │── Refresh Token ──────▶│                        │            │
│   │                        │── Validate ───────────▶│           │
│   │◀── New Access Token ───│                        │            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Token Structure
```typescript
// Access Token Payload
interface AccessTokenPayload {
  sub: string;           // User ID
  email: string;
  role: UserRole;
  iat: number;           // Issued at
  exp: number;           // Expiration (15 minutes)
  jti: string;           // JWT ID (for revocation)
}

// Refresh Token Payload
interface RefreshTokenPayload {
  sub: string;           // User ID
  iat: number;
  exp: number;           // Expiration (7 days)
  jti: string;
  version: number;        // For revocation
}
```

### Authentication Code
```typescript
// modules/auth/application/services/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly jwtService: JwtService,
    private readonly eventBus: IEventBus,
  ) {}
  
  async login(email: string, password: string): Promise<AuthTokens> {
    // 1. Find user
    const user = await this.userRepository.findByEmail(Email.create(email));
    if (!user) {
      throw new InvalidCredentialsException();
    }
    
    // 2. Verify password
    const isValid = await this.passwordHasher.verify(password, user.passwordHash);
    if (!isValid) {
      throw new InvalidCredentialsException();
    }
    
    // 3. Check if account is active
    if (user.props.deletedAt) {
      throw new AccountDeactivatedException();
    }
    
    // 4. Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    
    // 5. Store refresh token hash (for revocation)
    await this.storeRefreshToken(user.id, refreshToken);
    
    // 6. Publish login event
    await this.eventBus.publish(new UserLoggedInEvent(user));
    
    return { accessToken, refreshToken };
  }
  
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // 1. Verify refresh token
    const payload = this.jwtService.verify<RefreshTokenPayload>(refreshToken);
    
    // 2. Check if token is revoked
    const isValid = await this.isRefreshTokenValid(payload.jti);
    if (!isValid) {
      throw new TokenRevokedException();
    }
    
    // 3. Get user
    const user = await this.userRepository.findById(new UUID(payload.sub));
    if (!user) {
      throw new UserNotFoundException();
    }
    
    // 4. Revoke old token
    await this.revokeRefreshToken(payload.jti);
    
    // 5. Generate new tokens
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);
    
    await this.storeRefreshToken(user.id, newRefreshToken);
    
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
```

---

## 🔒 Authorization

### RBAC (Role-Based Access Control)
```typescript
// Common enums and interfaces
enum Permission {
  // Users
  USERS_CREATE = 'users:create',
  USERS_READ = 'users:read',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  
  // Study Sets
  STUDY_SETS_CREATE = 'study_sets:create',
  STUDY_SETS_READ_PUBLIC = 'study_sets:read:public',
  STUDY_SETS_READ_PRIVATE = 'study_sets:read:private',
  STUDY_SETS_UPDATE = 'study_sets:update',
  STUDY_SETS_DELETE = 'study_sets:delete',
  
  // Classes
  CLASSES_CREATE = 'classes:create',
  CLASSES_MANAGE = 'classes:manage',
  CLASSES_VIEW_PROGRESS = 'classes:view:progress',
  
  // Premium
  PREMIUM_FEATURES = 'premium:features',
  AI_FEATURES = 'ai:features',
}

enum Role {
  FREE = 'free',
  PLUS = 'plus',
  UNLIMITED = 'unlimited',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

// Role-Permission mapping
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.FREE]: [
    Permission.USERS_READ,
    Permission.STUDY_SETS_CREATE,
    Permission.STUDY_SETS_READ_PUBLIC,
    Permission.STUDY_SETS_READ_PRIVATE,
  ],
  [Role.PLUS]: [
    ...ROLE_PERMISSIONS[Role.FREE],
    Permission.PREMIUM_FEATURES,
  ],
  [Role.UNLIMITED]: [
    ...ROLE_PERMISSIONS[Role.PLUS],
    Permission.AI_FEATURES,
  ],
  [Role.TEACHER]: [
    ...ROLE_PERMISSIONS[Role.UNLIMITED],
    Permission.CLASSES_CREATE,
    Permission.CLASSES_MANAGE,
    Permission.CLASSES_VIEW_PROGRESS,
  ],
  [Role.ADMIN]: Object.values(Permission),
};
```

### Permission Guards
```typescript
// Decorator for requiring permissions
export const RequirePermissions = (...permissions: Permission[]) => 
  SetMetadata('permissions', permissions);

// Guard implementation
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<Permission[]>(
      'permissions',
      context.getHandler(),
    );
    
    if (!requiredPermissions?.length) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    const userPermissions = ROLE_PERMISSIONS[user.role];
    
    return requiredPermissions.every(
      (permission) => userPermissions.includes(permission),
    );
  }
}

// Usage in controller
@Controller('study-sets')
class StudySetsController {
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.STUDY_SETS_CREATE)
  async create(@Body() dto: CreateStudySetDto) { /* ... */ }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.STUDY_SETS_DELETE)
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    // Additional check: only owner can delete
    const set = await this.studySetService.findById(id);
    if (set.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
  }
}
```

### Resource-Based Authorization
```typescript
// For more granular control
@Injectable()
export class StudySetOwnershipGuard implements CanActivate {
  constructor(
    private readonly studySetRepository: IStudySetRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const setId = request.params.id;
    
    const studySet = await this.studySetRepository.findById(new UUID(setId));
    
    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }
    
    // Check ownership or membership
    if (studySet.userId === user.id) {
      return true; // Owner
    }
    
    // Check if it's a shared set
    if (studySet.visibility === Visibility.PUBLIC) {
      return true; // Public sets can be accessed
    }
    
    // Check class membership for private sets
    if (studySet.classId) {
      const isMember = await this.isClassMember(user.id, studySet.classId);
      if (isMember) return true;
    }
    
    throw new ForbiddenException('You do not have access to this study set');
  }
}
```

---

## 🛡️ Data Protection

### Password Hashing
```typescript
// Use bcrypt with proper configuration
interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 12; // NIST recommends 10+ for bcrypt
  
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

### Token Storage
```typescript
// Store hashed refresh tokens for revocation capability
@Entity()
export class RefreshTokenEntity {
  @PrimaryColumn()
  jti: string;  // JWT ID
  
  @Column()
  userId: string;
  
  @Column()
  tokenHash: string;  // Hash of refresh token
  
  @Column()
  expiresAt: Date;
  
  @Column({ default: false })
  revoked: boolean;
  
  @Column()
  revokedAt: Date;
}
```

### Data Encryption
```typescript
// For sensitive data at rest
@Injectable()
export class EncryptionService {
  constructor(private readonly config: ConfigService) {}
  
  private get key(): Buffer {
    return Buffer.from(this.config.encryptionKey, 'hex');
  }
  
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }
  
  decrypt(ciphertext: string): string {
    const [ivHex, authTagHex, encrypted] = ciphertext.split(':');
    
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.key,
      Buffer.from(ivHex, 'hex'),
    );
    
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

---

## 🚫 Security Headers

### NestJS Configuration
```typescript
// main.ts
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security headers
  app.use(helmet());
  
  // CORS
  app.enableCors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 86400,
  });
  
  // Rate limiting
  app.enableCors({
    // ...
  });
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  
  await app.listen(3000);
}
```

### Helmet Configuration
```typescript
// common/middleware/helmet.middleware.ts
import helmet from 'helmet';

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://api.quizlet-clone.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});
```

---

## 📊 Security Monitoring

### Audit Logging
```typescript
// Audit event types
enum AuditEventType {
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  USER_REGISTER = 'user.register',
  USER_PASSWORD_CHANGE = 'user.password_change',
  STUDY_SET_CREATE = 'study_set.create',
  STUDY_SET_DELETE = 'study_set.delete',
  CLASS_CREATE = 'class.create',
  // ...
}

// Audit Log Entity
@Entity('audit_logs')
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'enum', enum: AuditEventType })
  eventType: AuditEventType;
  
  @Column({ nullable: true })
  userId: string;
  
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
  
  @Column()
  ipAddress: string;
  
  @Column()
  userAgent: string;
  
  @Column({ type: 'timestamp' })
  occurredAt: Date;
}

// Audit service
@Injectable()
export class AuditService {
  async log(
    eventType: AuditEventType,
    userId: string | null,
    metadata: Record<string, any>,
    request: Request,
  ): Promise<void> {
    await this.auditLogRepository.save({
      eventType,
      userId,
      metadata,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      occurredAt: new Date(),
    });
  }
}
```

### Rate Limit Monitoring
```typescript
// Redis-based rate limiting with monitoring
@Injectable()
export class RateLimitService {
  constructor(private readonly redis: Redis) {}
  
  async checkRateLimit(
    key: string,
    limit: number,
    windowMs: number,
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    const now = Date.now();
    const windowKey = `ratelimit:${key}:${Math.floor(now / windowMs)}`;
    
    const current = await this.redis.incr(windowKey);
    
    if (current === 1) {
      await this.redis.pexpire(windowKey, windowMs);
    }
    
    const resetAt = new Date(Math.ceil(now / windowMs) * windowMs);
    
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      resetAt,
    };
  }
}
```

---

## 🔒 Security Checklist

### Authentication
- [x] Password hashing (bcrypt, 12 rounds)
- [x] JWT with short expiration (15 min)
- [x] Refresh tokens with rotation
- [x] Token revocation capability
- [x] Account lockout (5 failed attempts)
- [x] Password reset with secure tokens
- [x] Email verification

### Authorization
- [x] RBAC with permission system
- [x] Resource-based authorization
- [x] Ownership verification
- [x] Premium feature gating

### Data Protection
- [x] Encryption at rest (sensitive data)
- [x] TLS 1.2+ in transit
- [x] Input validation (Zod/class-validator)
- [x] SQL injection prevention (TypeORM)
- [x] XSS prevention (output encoding)
- [x] CSRF tokens

### Infrastructure
- [x] Security headers (Helmet)
- [x] CORS configuration
- [x] Rate limiting
- [x] Request size limits
- [x] Audit logging
- [x] Error handling (no stack traces in prod)
