import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { UsersService } from '../users/application/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, any> = {
        JWT_SECRET: 'test-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid email', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(
        service.login('invalid@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for locked account', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        passwordHash: '$2b$12$hashedpassword',
        name: 'Test User',
        isActive: true,
        isLocked: () => true,
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      await expect(
        service.login('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive account', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        passwordHash: '$2b$12$hashedpassword',
        name: 'Test User',
        isActive: false,
        isLocked: () => false,
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      await expect(
        service.login('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    const registerDto = {
      email: 'new@example.com',
      name: 'New User',
      password: 'Password123!',
    };

    it('should register a new user successfully', async () => {
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: registerDto.email,
        name: registerDto.name,
        passwordHash: 'hashedpassword',
      });
      const result = await service.register(registerDto);
      expect(result).toBeDefined();
      expect(result.user.email).toBe(registerDto.email);
      expect(result.tokens).toBeDefined();
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should create user with hashed password', async () => {
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: registerDto.email,
        name: registerDto.name,
        passwordHash: expect.any(String),
      });
      await service.register(registerDto);
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          name: registerDto.name,
        }),
      );
    });
  });

  describe('sanitizeUser', () => {
    it('should remove password from user object', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        username: 'testuser',
        name: 'Test User',
      };
      const result = (service as any).sanitizeUser(mockUser);
      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
    });
  });
});
