# 06 - Design Patterns & SOLID Implementation

## 🎯 SOLID Principles

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOLID PRINCIPLES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  S - Single Responsibility Principle (SRP)                     │
│  O - Open/Closed Principle (OCP)                              │
│  L - Liskov Substitution Principle (LSP)                       │
│  I - Interface Segregation Principle (ISP)                      │
│  D - Dependency Inversion Principle (DIP)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Single Responsibility Principle (SRP)

### ❌ Bad Example
```typescript
// UserService handles everything - VIOLATION of SRP
class UserService {
  async createUser(data: CreateUserDto) { /* create */ }
  async sendEmail(user: User) { /* send welcome email */ }
  async logActivity(user: User) { /* log to analytics */ }
  async calculateMetrics(user: User) { /* calculate stats */ }
  async generateReport(user: User) { /* generate PDF report */ }
}
```

### ✅ Good Example
```typescript
// Each class has ONE responsibility
class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventBus: IEventBus,
  ) {}
  async createUser(data: CreateUserDto) {
    const user = User.create({ ... });
    await this.userRepository.save(user);
    await this.eventBus.publish(new UserCreatedEvent(user));
    return user;
  }
}

class EmailService {
  async sendWelcomeEmail(user: User) { /* send email */ }
}

class AnalyticsService {
  async logUserActivity(userId: string, action: string) { /* log */ }
}

class MetricsService {
  async calculateUserMetrics(userId: string) { /* calculate */ }
}

class ReportGeneratorService {
  async generateUserReport(userId: string) { /* generate PDF */ }
}
```

---

## 2. Open/Closed Principle (OCP)

### ❌ Bad Example
```typescript
// Adding new study modes requires modifying this class - VIOLATION
class StudyModeService {
  startStudyMode(mode: string, setId: string) {
    if (mode === 'learn') { /* learn logic */ }
    else if (mode === 'test') { /* test logic */ }
    else if (mode === 'match') { /* match logic */ }
    // Every new mode requires modification
  }
}
```

### ✅ Good Example
```typescript
// Open for extension, Closed for modification
interface IStudyMode {
  start(setId: string): Promise<void>;
  submitAnswer(answer: Answer): Promise<Result>;
  complete(): Promise<Completion>;
}

// Learn Mode
@Injectable()
class LearnMode implements IStudyMode {
  async start(setId: string) { /* learn specific logic */ }
  async submitAnswer(answer: Answer) { /* adaptive learning */ }
  async complete() { /* completion logic */ }
}

// Test Mode
@Injectable()
class TestMode implements IStudyMode {
  async start(setId: string) { /* test specific logic */ }
  async submitAnswer(answer: Answer) { /* test scoring */ }
  async complete() { /* test results */ }
}

// Match Mode
@Injectable()
class MatchMode implements IStudyMode {
  async start(setId: string) { /* match specific logic */ }
  async submitAnswer(answer: Answer) { /* matching logic */ }
  async complete() { /* game results */ }
}

// Factory for creating modes
@Injectable()
class StudyModeFactory {
  constructor(
    private readonly learnMode: LearnMode,
    private readonly testMode: TestMode,
    private readonly matchMode: MatchMode,
  ) {}
  
  create(mode: StudyModeType): IStudyMode {
    switch (mode) {
      case StudyModeType.LEARN: return this.learnMode;
      case StudyModeType.TEST: return this.testMode;
      case StudyModeType.MATCH: return this.matchMode;
    }
  }
}

// Usage
class StudySessionService {
  constructor(private readonly factory: StudyModeFactory) {}
  
  startSession(setId: string, mode: StudyModeType) {
    const studyMode = this.factory.create(mode);
    // Polymorphism - no modification needed for new modes
    return studyMode.start(setId);
  }
}
```

---

## 3. Liskov Substitution Principle (LSP)

### ❌ Bad Example
```typescript
// Subclass cannot fully substitute parent
class StudySet {
  getCards(): Card[] { return this.cards; }
  addCard(card: Card): void { this.cards.push(card); }
}

class ReadOnlyStudySet extends StudySet {
  // LSP VIOLATION - addCard throws error
  addCard(card: Card): void {
    throw new Error('Read-only set cannot add cards');
  }
}

function processStudySet(set: StudySet) {
  set.addCard(newCard); // Works for StudySet, fails for ReadOnlyStudySet
}
```

### ✅ Good Example
```typescript
// Proper interface segregation
interface IReadable {
  getCards(): Card[];
}

interface IWritable {
  addCard(card: Card): void;
  removeCard(cardId: string): void;
}

class StudySet implements IReadable, IWritable {
  getCards(): Card[] { return this.cards; }
  addCard(card: Card): void { this.cards.push(card); }
  removeCard(cardId: string): void { /* remove */ }
}

class ReadOnlyStudySet implements IReadable {
  constructor(private readonly cards: Card[]) {}
  getCards(): Card[] { return this.cards; }
  // Cannot add cards - by design, not by exception
}

function displaySet(set: IReadable) {
  console.log(set.getCards()); // Works for both
}

function editSet(set: IWritable) {
  set.addCard(newCard); // Only called when appropriate
}
```

---

## 4. Interface Segregation Principle (ISP)

### ❌ Bad Example
```typescript
// One massive interface
interface IUserService {
  createUser(data: CreateUserDto): Promise<User>;
  updateUser(id: string, data: UpdateUserDto): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getUser(id: string): Promise<User>;
  getUserStats(id: string): Promise<UserStats>;
  changePassword(id: string, oldPw: string, newPw: string): Promise<void>;
  uploadAvatar(id: string, file: File): Promise<string>;
  getStudyHistory(id: string): Promise<StudySession[]>;
  // ... too many methods
}

// Client only needs user creation
class UserRegistration {
  constructor(private readonly userService: IUserService) {} // Forced to depend on all methods
}
```

### ✅ Good Example
```typescript
// Segregated interfaces
interface IUserCreator {
  createUser(data: CreateUserDto): Promise<User>;
}

interface IUserUpdater {
  updateUser(id: string, data: UpdateUserDto): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

interface IUserReader {
  getUser(id: string): Promise<User>;
}

interface IUserProfileManager {
  changePassword(id: string, oldPw: string, newPw: string): Promise<void>;
  uploadAvatar(id: string, file: File): Promise<string>;
}

interface IUserStatsProvider {
  getUserStats(id: string): Promise<UserStats>;
  getStudyHistory(id: string): Promise<StudySession[]>;
}

// UserRegistration only depends on what it needs
class UserRegistration {
  constructor(private readonly userCreator: IUserCreator) {}
}

// UserProfileService implements multiple interfaces
@Injectable()
class UserService implements 
  IUserCreator, 
  IUserUpdater, 
  IUserReader, 
  IUserProfileManager,
  IUserStatsProvider {
  // Implementation
}
```

---

## 5. Dependency Inversion Principle (DIP)

### ❌ Bad Example
```typescript
// High-level module depends on low-level module
class StudySetController {
  constructor(
    private readonly typeOrmRepo: TypeOrmStudySetRepository, // Direct dependency
  ) {}
  
  async getStudySets() {
    // Tied to TypeORM - hard to test, hard to change
    return this.typeOrmRepo.findAll();
  }
}
```

### ✅ Good Example
```typescript
// High-level module depends on abstraction
class StudySetController {
  constructor(
    private readonly studySetRepository: IStudySetRepository, // Interface
  ) {}
  
  async getStudySets() {
    // Depends on abstraction, not implementation
    return this.studySetRepository.findAll();
  }
}

// Low-level module implements interface
@Injectable()
class TypeOrmStudySetRepository implements IStudySetRepository {
  constructor(@InjectRepository(StudySet) private readonly repo: Repository<StudySet>) {}
  
  async findAll(): Promise<StudySet[]> {
    return this.repo.find();
  }
  
  async findById(id: string): Promise<StudySet | null> {
    return this.repo.findOne({ where: { id } });
  }
  
  async save(set: StudySet): Promise<void> {
    await this.repo.save(set);
  }
}

// Dependency injection in module
@Module({
  providers: [
    StudySetController,
    {
      provide: IStudySetRepository,
      useClass: TypeOrmStudySetRepository,
    },
  ],
})
export class StudySetModule {}
```

---

## 🔧 Additional Patterns

### 1. Repository Pattern
```typescript
// Domain - Interface
interface IRepository<T, TId> {
  findById(id: TId): Promise<T | null>;
  findAll(filter?: Filter): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: TId): Promise<void>;
}

// Application - Use abstraction
class GetStudySetQueryHandler {
  constructor(
    @Inject(INJECTIONS.STUDY_SET_REPOSITORY)
    private readonly repository: IRepository<StudySet, UUID>,
  ) {}
}

// Infrastructure - Implement abstraction
@Injectable()
class TypeOrmStudySetRepository implements IRepository<StudySet, UUID> {
  constructor(
    @InjectRepository(StudySetEntity)
    private readonly repo: Repository<StudySetEntity>,
  ) {}
  
  async findById(id: UUID): Promise<StudySet | null> {
    const entity = await this.repo.findOne({ where: { id: id.value } });
    return entity ? this.mapper.toDomain(entity) : null;
  }
}
```

### 2. Unit of Work Pattern
```typescript
// Unit of Work for transactions
interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  
  get users(): IUserRepository;
  get studySets(): IStudySetRepository;
  get cards(): ICardRepository;
}

@Injectable()
class TypeOrmUnitOfWork implements IUnitOfWork {
  private transaction: QueryRunner;
  
  async begin(): Promise<void> {
    this.transaction = this.dataSource.createQueryRunner();
    await this.transaction.connect();
    await this.transaction.startTransaction();
  }
  
  async commit(): Promise<void> {
    await this.transaction.commitTransaction();
  }
  
  async rollback(): Promise<void> {
    await this.transaction.rollbackTransaction();
  }
  
  get users(): IUserRepository {
    return new TransactionalUserRepository(this.transaction);
  }
}

// Usage
class EnrollStudentCommandHandler {
  constructor(private readonly uow: IUnitOfWork) {}
  
  async execute(command: EnrollStudentCommand): Promise<void> {
    await this.uow.begin();
    
    try {
      const student = await this.uow.users.findById(command.studentId);
      const classEntity = await this.uow.classes.findById(command.classId);
      
      classEntity.addStudent(student);
      
      await this.uow.classes.save(classEntity);
      await this.uow.commit();
    } catch (error) {
      await this.uow.rollback();
      throw error;
    }
  }
}
```

### 3. Factory Pattern
```typescript
// Factory for creating domain objects
interface IEntityFactory<T> {
  create(props: CreateProps<T>): T;
}

class StudySetFactory implements IEntityFactory<StudySet> {
  create(props: CreateStudySetProps): StudySet {
    const set = StudySet.create({
      title: props.title,
      description: props.description,
      visibility: props.visibility ?? Visibility.PUBLIC,
      userId: props.userId,
    });
    
    if (props.cards) {
      for (const cardProps of props.cards) {
        set.addCard(Card.create(cardProps));
      }
    }
    
    return set;
  }
}
```

### 4. Observer Pattern (Domain Events)
```typescript
// Domain Event
abstract class DomainEvent {
  readonly occurredAt: Date = new Date();
}

// Event Publisher
interface IEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => Promise<void>,
  ): void;
}

// Domain Entity publishes events
class User extends Entity<UUID, UserProps> {
  private events: DomainEvent[] = [];
  
  changePassword(newPasswordHash: string): void {
    this.props.passwordHash = newPasswordHash;
    this.events.push(new PasswordChangedEvent(this));
  }
  
  pullEvents(): DomainEvent[] {
    const events = [...this.events];
    this.events = [];
    return events;
  }
}

// Event Handler
@EventHandler(PasswordChangedEvent)
class SendPasswordChangedEmailHandler {
  constructor(private readonly emailService: IEmailService) {}
  
  async handle(event: PasswordChangedEvent): Promise<void> {
    await this.emailService.sendPasswordChangedEmail(event.user);
  }
}
```

### 5. CQRS Pattern
```typescript
// Command
class CreateStudySetCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly userId: string,
  ) {}
}

// Command Handler
@CommandHandler(CreateStudySetCommand)
class CreateStudySetHandler implements ICommandHandler<CreateStudySetCommand> {
  async execute(command: CreateStudySetCommand): Promise<StudySet> {
    // Write logic - validation, business rules
    const studySet = StudySet.create({ ... });
    await this.repository.save(studySet);
    return studySet;
  }
}

// Query
class GetStudySetDetailQuery {
  constructor(public readonly id: string) {}
}

// Query Handler (Separate - optimized for reads)
@QueryHandler(GetStudySetDetailQuery)
class GetStudySetDetailHandler implements IQueryHandler<GetStudySetDetailQuery, StudySetDetailDto> {
  async execute(query: GetStudySetDetailQuery): Promise<StudySetDetailDto> {
    // Read logic - joins, projections
    return this.readDb.query(`
      SELECT s.*, u.name as author_name, 
             COUNT(c.id) as card_count,
             COUNT(DISTINCT l.user_id) as like_count
      FROM study_sets s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN cards c ON c.study_set_id = s.id
      LEFT JOIN likes l ON l.study_set_id = s.id
      WHERE s.id = $1
      GROUP BY s.id, u.name
    `, [query.id]);
  }
}
```

### 6. Strategy Pattern
```typescript
// SRS Algorithm Strategy
interface ISrsStrategy {
  calculateNextReview(
    card: Card,
    result: ReviewResult,
    currentState: CardSrsState,
  ): SrsSchedule;
}

// SM-2 Algorithm
class Sm2SrsStrategy implements ISrsStrategy {
  calculateNextReview(card, result, state): SrsSchedule {
    // SM-2 algorithm implementation
    const newEaseFactor = this.calculateEaseFactor(state.easeFactor, result);
    const newInterval = this.calculateInterval(state.interval, newEaseFactor, result);
    
    return {
      nextReviewAt: addDays(new Date(), newInterval),
      easeFactor: newEaseFactor,
      interval: newInterval,
    };
  }
}

// FSRS (Frequency Scheduling) Strategy
class FsrsSrsStrategy implements ISrsStrategy {
  calculateNextReview(card, result, state): SrsSchedule {
    // FSRS algorithm implementation
    // More modern, memory modeling
  }
}

// Factory
@Injectable()
class SrsStrategyFactory {
  create(algorithm: SrsAlgorithm): ISrsStrategy {
    switch (algorithm) {
      case SrsAlgorithm.SM2: return new Sm2SrsStrategy();
      case SrsAlgorithm.FSRS: return new FsrsSrsStrategy();
    }
  }
}
```

---

## 📊 Pattern Usage Map

```
┌─────────────────────────────────────────────────────────────────┐
│                 PATTERN USAGE BY LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DOMAIN LAYER:                                                 │
│  ├── Entity & Value Object                                      │
│  ├── Domain Service                                             │
│  ├── Domain Events (Observer)                                   │
│  └── Factory Pattern                                           │
│                                                                 │
│  APPLICATION LAYER:                                            │
│  ├── CQRS (Command & Query Handlers)                           │
│  ├── Unit of Work                                              │
│  └── Application Service                                       │
│                                                                 │
│  INFRASTRUCTURE LAYER:                                         │
│  ├── Repository Pattern (implementations)                      │
│  ├── Strategy Pattern (implementations)                        │
│  └── External Service Adapters                                 │
│                                                                 │
│  PRESENTATION LAYER:                                          │
│  ├── DTO Pattern                                               │
│  └── Controller/Resolver                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ SOLID Checklist

- [ ] Each class has only one reason to change (SRP)
- [ ] Classes are open for extension, closed for modification (OCP)
- [ ] Subclasses can substitute their base classes (LSP)
- [ ] Clients depend on specific interfaces, not large ones (ISP)
- [ ] High-level modules don't depend on low-level modules (DIP)
- [ ] Dependency injection is used throughout
- [ ] Domain layer has no external dependencies
- [ ] Business logic is in domain/application layers
- [ ] Infrastructure implements domain interfaces
