/**
 * User Repository Interface - Domain Layer
 * Infrastructure layer will implement this interface
 * NO implementation here
 */
import { User } from '../entities/user';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}
