import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
} from '@loopback/authorization';

export async function attributeAccessAuthorizer(
  authCtx: AuthorizationContext,
  meta: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  console.log(meta.scopes, ' the scopes for authorization');
  console.log('kontolan stephan');
  if (!meta.scopes) return AuthorizationDecision.ALLOW;
  return AuthorizationDecision.ALLOW;
}

// export class MyAuthorizer implements Provider<Authorizer> {
//   value(): Authorizer {
//     return this.authorize.bind(this);
//   }

//   async authorize(ctx: AuthorizationContext, meta: AuthorizationMetadata) {
//     console.log(ctx.principals, 'the context principle');
//     console.log(ctx.resource, 'the context resource');
//     console.log(meta, 'the metadata');
//     return AuthorizationDecision.ALLOW;
//   }
// }
