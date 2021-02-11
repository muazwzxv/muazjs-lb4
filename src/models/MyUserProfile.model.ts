import {UserProfile} from '@loopback/security';

export interface MyUserProfile extends UserProfile {
  permissions: Array<string>;
}
