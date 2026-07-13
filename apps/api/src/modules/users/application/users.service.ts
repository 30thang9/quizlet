import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { User, UserRole } from '../domain/entities/user';
import { IUserRepository } from '../domain/repositories/user.repository.interface';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  name: string;
  role?: UserRole;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    readonly userRepository: IUserRepository,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(data: CreateUserData): Promise<User> {
    const exists = await this.userRepository.existsByEmail(data.email);
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const user = User.create({
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      role: data.role || 'free',
      isActive: true,
      failedLoginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRepository.save(user);
    return user;
  }

  async updateProfile(id: string, data: { name?: string; avatarUrl?: string; bio?: string }): Promise<User> {
    const user = await this.findById(id);
    user.updateProfile(data);
    await this.userRepository.update(user);
    return user;
  }

  async softDelete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
