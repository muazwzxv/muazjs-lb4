import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';

// export async function attributeAccessAuthorizer(
//   authCtx: AuthorizationContext,
//   meta: AuthorizationMetadata,
// ): Promise<AuthorizationDecision> {
//   console.log(meta.scopes, ' the scopes for authorization');

//   if (!meta.scopes) return AuthorizationDecision.ALLOW;

//   if (_.intersection())

// }

export class MyAuthorizer implements Provider<Authorizer> {
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(ctx: AuthorizationContext, meta: AuthorizationMetadata) {
    events.push(ctx.resource);
    console.log(ctx.principals, 'the context principle');
    return AuthorizationDecision.ALLOW;
  }
}
