import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import {promisify} from 'util';
import {TokenServiceConstant} from '../../../keys';
import {UserRepository} from '../../../repositories';

// Convert callbacks to Promise1
// const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @inject(TokenServiceConstant.TOKEN_SECRET_VALUE)
    private jwtSecret: string,

    @inject(TokenServiceConstant.TOKEN_EXPIRE_IN_VALUE)
    private tokenExpire: Number,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token)
      throw new HttpErrors.Unauthorized('Error verifying token: token is null');

    const decrypted = await verifyAsync(
      token,
      TokenServiceConstant.TOKEN_SECRET_VALUE,
    );

    const user = _.pick(decrypted, [
      'id',
      'email',
      'name',
      'permissions',
    ]) as UserProfile;

    return user;
  }

  test() {
    console.log('Hello world');
  }

  async generateToken(user: UserProfile): Promise<string> {
    return '';
  }
}
