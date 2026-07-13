/**
 * @deprecated Use these imports instead:
 * - Domain User: import { User } from './user'
 * - TypeORM Entity: import { UserEntity } from '../../infrastructure/persistence/entities/user.entity'
 * - UserRole enum: import { UserRole } from '../../infrastructure/persistence/entities/user.entity'
 * 
 * This file is kept for backward compatibility
 */
export { UserEntity, UserRole } from '../../infrastructure/persistence/entities/user.entity';
import { User } from './user';
export { User };
