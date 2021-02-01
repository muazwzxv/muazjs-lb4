import {Provider} from '@loopback/context';
import {intersection} from 'lodash';
import {
  PermissionKey,
  RequiredPermisisons,
  UserPermissionfn,
} from '../components/authorization';

export class UserPermissionsProvider implements Provider<UserPermissionfn> {
  constructor() {}

  value(): UserPermissionfn {
    return (userPermisisons, requiredPermissions) =>
      this.action(userPermisisons, requiredPermissions);
  }

  action(
    userPermission: PermissionKey[],
    requiredPermissions: RequiredPermisisons,
  ): boolean {
    return (
      intersection(userPermission, requiredPermissions.required).length ===
      requiredPermissions.required.length
    );
  }
}
