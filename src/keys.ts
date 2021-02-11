import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {UserPermissionfn} from './components/authorization';
import {PasswordHasher} from './services/hash.password.bcrypt';

/**
 * Binding keys need for the project
 */
export namespace TokenServiceConstant {
  export const TOKEN_SECRET_VALUE = process.env.TOKENSECRET ?? 'suckmydick';
  export const TOKEN_EXPIRE_IN_VALUE = '2000';
}

export namespace MyAuthBindings {
  export const USER_PERMISSIONS = BindingKey.create<UserPermissionfn>(
    'userAuthorization.actions.userPermissions',
  );

  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRE = BindingKey.create<string>(
    'authentication.jwt.expire.in.second',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'service.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}
