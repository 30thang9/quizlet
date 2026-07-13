import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { User, UserRole } from '../domain/entities/user.entity';

export const IUsersRepository = 'IUsersRepository';

export interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  save(user: User): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  softDelete(id: string): Promise<void>;
}

export interface CreateUserData {
  email: string;
  passwordHash: string;
  name: string;
  role?: UserRole;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async create(data: CreateUserData): Promise<User> {
    const exists = await this.usersRepository.existsByEmail(data.email);
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const user = new User();
    user.email = data.email;
    user.passwordHash = data.passwordHash;
    user.name = data.name;
    user.role = data.role || UserRole.FREE;
    user.isActive = true;
    user.failedLoginAttempts = 0;

    return this.usersRepository.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.usersRepository.update(id, data);
  }

  async softDelete(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
