/**
 * User Mapper - Infrastructure Layer
 * Maps between Domain User and TypeORM UserEntity
 */
import { User, UserProps, UserRole } from '../../../domain/entities/user';
import { UserEntity, UserRole as UserRoleEnum } from '../entities/user.entity';

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
    entity.passwordHash = user.propsCopy.passwordHash;
    entity.name = user.name;
    entity.avatarUrl = user.avatarUrl;
    entity.bio = user.bio;
    entity.role = user.role as UserRoleEnum;
    entity.emailVerifiedAt = user.propsCopy.emailVerifiedAt;
    entity.isActive = user.isActive;
    entity.failedLoginAttempts = user.failedLoginAttempts;
    entity.lockedUntil = user.lockedUntil;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    entity.deletedAt = user.propsCopy.deletedAt;
    return entity;
  }
}
