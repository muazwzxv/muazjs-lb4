
import {PermissionKey} from './permission-key';

export interface RequiredPermisisons {
  required: PermissionKey[]
}

export interface UserPermissionfn {
  (
    userPermission: PermissionKey[],
    requiredPermissions: RequiredPermisisons
  ): boolean
}

export interface MyUserProfile {
  uuid: string
  email: string
  name: string
  permissions: PermissionKey[]
}



