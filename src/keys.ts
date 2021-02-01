import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {UserPermissionfn} from './components/authorization';

/**
 * Binding keys need for the project
 */

export namespace MyAuthBindings {
  export const USER_PERMISSIONS = BindingKey.create<UserPermissionfn>(
    'userAuthorization.actions.userPermissions',
  );

  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace TokenServiceConstant {
  export const TOKEN_SECRET_VALUE = process.env.TOKENSECRET ?? 'suckmydick';
  export const TOKEN_EXPIRE_IN_VALUE = '2000';
}
