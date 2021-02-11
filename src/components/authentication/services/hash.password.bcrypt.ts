import {inject} from '@loopback/core';
import {compare, genSalt, hash} from 'bcrypt';
import {PasswordHasherBindings} from '../../../keys';

export interface PasswordHasher<T = string> {
  hashPassword(pass: T): Promise<T>;
  comparePassword(providePass: T, storedPass: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  constructor(
    @inject(PasswordHasherBindings.ROUNDS)
    private readonly rounds: number,
  ) {}

  async hashPassword(pass: string): Promise<string> {
    const salt = await genSalt(this.rounds);
    return hash(pass, salt);
  }

  async comparePassword(
    providePass: string,
    storedPass: string,
  ): Promise<boolean> {
    return compare(providePass, storedPass);
  }
}
