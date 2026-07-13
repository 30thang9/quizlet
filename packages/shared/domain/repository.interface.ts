import { Entity } from './entity';
import { Identifier } from './identifier';

/**
 * Base Repository interface for Clean Architecture
 * Domain layer defines this interface, Infrastructure implements it
 */
export interface Repository<T extends Entity<I>, I extends Identifier<any>> {
  findById(id: I): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: I): Promise<void>;
}

/**
 * Base Query Repository interface for read operations
 */
export interface QueryRepository<T, Filter = any> {
  findAll(filter?: Filter): Promise<T[]>;
  findOne(filter: Filter): Promise<T | null>;
}
