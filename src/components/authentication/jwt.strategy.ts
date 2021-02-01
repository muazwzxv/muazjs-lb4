import {
  AuthenticationBindings,
  AuthenticationMetadata,
  AuthenticationStrategy,
  TokenService,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {MyAuthBindings} from '../../keys';
import {UserPermissionfn} from '../authorization';

export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,

    @inject(MyAuthBindings.USER_PERMISSIONS)
    public checkPermissions: UserPermissionfn,

    @inject(MyAuthBindings.TOKEN_SERVICE)
    protected tokenService: TokenService,
  ) {}

  async authenticate(req: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(req);
    try {
      const user: UserProfile = await this.tokenService.verifyToken(token);
      return user;
    } catch (err) {
      Object.assign(err, {code: 'INVALID_ACCESS_TOKEN', statusCode: 401});
      throw err;
    }
  }

  extractCredentials(req: Request): string {
    if (!req.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization headers not found');
    }

    const headerVal = req.headers.authorization;

    if (!headerVal.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        'Authorization headers not of type Bearer',
      );
    }

    const parts = headerVal.split(' ');

    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        'Authorization header does not follow "Bearer xx.yy.zz"',
      );
    const token = parts[1];
    return token;
  }
}
