/**
 * Base Identifier class for entities
 */
export abstract class Identifier<T = string> {
  constructor(readonly value: T) {}

  equals(id: Identifier<T>): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    return this.value === id.value;
  }
}

/**
 * UUID Identifier implementation
 */
export class UUID extends Identifier<string> {
  constructor(value: string) {
    super(value);
  }

  static create(): UUID {
    return new UUID(crypto.randomUUID());
  }

  static fromString(value: string): UUID {
    return new UUID(value);
  }
}
