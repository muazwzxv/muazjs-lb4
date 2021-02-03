import {
  AuthenticationBindings,
  AuthenticationMetadata,
} from '@loopback/authentication';
import {
  Getter,
  /* inject, */
  globalInterceptor,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  MyUserProfile,
  RequiredPermisisons,
  UserPermissionfn,
} from '../components/authorization';
import {MyAuthBindings} from '../keys';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'authorize'}})
export class AuthorizeInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,

    @inject(MyAuthBindings.USER_PERMISSIONS)
    protected checkPermissions: UserPermissionfn,

    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>,
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    if (!this.metadata) return next();

    const requiredPermisions = this.metadata.options as RequiredPermisisons;
    const user = await this.getCurrentUser();
    if (!this.checkPermissions(user.permissions, requiredPermisions)) {
      throw new HttpErrors.Forbidden('INVALID_ACCESS_PERMISSION');
    }
    return next();
  }
}
