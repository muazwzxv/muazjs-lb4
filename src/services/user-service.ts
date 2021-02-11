import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {PasswordHasherBindings} from '../keys';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {Credentials, MyUserProfile} from '../types';
import {PasswordHasher} from './hash.password.bcrypt';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const {email, password} = credentials;
    const invalid = 'Invalid email or password';

    if (!email) throw new HttpErrors.Unauthorized(invalid);
    const found = await this.userRepository.findOne({
      where: {email},
    });
    if (!found) throw new HttpErrors.Unauthorized(invalid);

    const credFound = await this.userRepository.findCredentials(found.uuid);
    if (!credFound) throw new HttpErrors.Unauthorized(invalid);

    const isPasswordMatched = await this.hasher.comparePassword(
      password,
      credFound.password,
    );
    if (!isPasswordMatched) throw new HttpErrors.Unauthorized(invalid);

    return found;
  }

  convertToUserProfile(user: User): MyUserProfile {
    return {
      name: user.email,
      permissions: user.permissions,
    } as MyUserProfile;
  }
}
