import {PermissionKey} from './permission-key';

export interface RequiredPermisisons {
  required: PermissionKey[];
}

export interface UserPermissionfn {
  (
    userPermission: PermissionKey[],
    requiredPermissions: RequiredPermisisons,
  ): boolean;
}

export interface MyUserProfile {
  uuid: string;
  email: string;
  name: string;
  permissions: PermissionKey[];
}

export const UserProfileSchema = {
  type: 'object',
  required: ['email', 'password', 'name'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    name: {type: 'string'},
  },
};

export const UserRequestBody = {
  description: 'The input to create a user',
  required: true,
  content: {
    'application/json': {schema: UserProfileSchema},
  },
};

export interface Credentials {
  email: string;
  password: string;
  permissions: PermissionKey[];
}

export const CredentialSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },

    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {jsonSchema: CredentialSchema},
  },
};
