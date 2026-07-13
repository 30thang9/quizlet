import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserRole } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      select: [
        'id',
        'email',
        'passwordHash',
        'name',
        'avatarUrl',
        'bio',
        'role',
        'isActive',
        'isEmailVerified',
        'failedLoginAttempts',
        'lockedUntil',
        'createdAt',
      ],
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email: email.toLowerCase() },
    });
    return count > 0;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.existsByEmail(dto.email);
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email.toLowerCase(),
      passwordHash,
      name: dto.name,
      avatarUrl: dto.avatarUrl,
      bio: dto.bio,
      role: dto.role || UserRole.FREE,
      isActive: true,
      isEmailVerified: false,
      failedLoginAttempts: 0,
    });

    return this.userRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.avatarUrl !== undefined) user.avatarUrl = dto.avatarUrl;
    if (dto.bio !== undefined) user.bio = dto.bio;

    return this.userRepository.save(user);
  }

  async softDelete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.softDelete(id);
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmailWithPassword(email);
    if (!user) return null;

    if (user.isLocked()) {
      throw new BadRequestException('Account is temporarily locked');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      user.incrementFailedLogin();
      await this.userRepository.save(user);
      return null;
    }

    user.resetFailedLogin();
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return user;
  }

  async findAll(
    page = 1,
    limit = 20,
    role?: UserRole,
    isActive?: boolean,
  ): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { users, total };
  }

  async createPasswordResetToken(email: string): Promise<{ token: string; expiresAt: Date } | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    user.resetToken = token;
    user.resetTokenExpiresAt = expiresAt;
    await this.userRepository.save(user);

    return { token, expiresAt };
  }

  async validatePasswordResetToken(token: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExpiresAt: MoreThan(new Date()),
      },
    });

    return user || null;
  }

  async resetPassword(token: string, newPassword: string): Promise<User | null> {
    const user = await this.validatePasswordResetToken(token);
    if (!user) {
      return null;
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = null as any;
    user.resetTokenExpiresAt = null as any;
    await this.userRepository.save(user);

    return user;
  }
}
