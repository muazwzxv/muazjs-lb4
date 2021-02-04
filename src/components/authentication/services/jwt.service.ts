import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {toJSON} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import {promisify} from 'util';
import {TokenServiceConstant} from '../../../keys';
import {UserRepository} from '../../../repositories';
import {Credentials} from '../../authorization/types';

// Convert callbacks to Promise1
const signAsync = promisify(jwt.sign);
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

    const decrypted = await verifyAsync(token, this.jwtSecret);

    const user = _.pick(decrypted, [
      'id',
      'email',
      'name',
      'permissions',
    ]) as UserProfile;

    return user;
  }

  async generateToken(user: UserProfile): Promise<string> {
    const token = await signAsync(user, this.jwtSecret);

    return token as string;
  }

  async getToken(credential: Credentials): Promise<string> {
    const found = await this.userRepository.findOne({
      where: {email: credential.email},
    });

    if (!found)
      throw new HttpErrors['Not Found'](
        `user with email ${credential.email} not found`,
      );

    if (credential.password !== found.password)
      throw new HttpErrors.Unauthorized('The credentials are not correct');

    const user = _.pick(toJSON(found), [
      'email',
      'name',
      'permissions',
    ]) as UserProfile;

    const token = await this.generateToken(user);
    return token;
  }
}
