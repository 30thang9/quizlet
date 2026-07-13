/**
 * Base Entity class for Clean Architecture
 * Domain layer should NOT depend on any infrastructure (TypeORM, etc.)
 */
export abstract class Entity<T = string> {
  protected abstract readonly _id: T;

  get id(): T {
    return this._id;
  }

  equals(entity: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    return this._id === entity._id;
  }
}

/**
 * Base class for Domain Events
 */
export abstract class DomainEvent {
  readonly occurredAt: Date;

  constructor() {
    this.occurredAt = new Date();
  }
}
