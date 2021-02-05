import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {AuthorizationTags} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTStrategy} from './components/authentication';
import {JWTService} from './components/authorization';
import {MyAuthorizer} from './components/authorization/myAuthorizer.authorizer';
import {
  MyAuthBindings,
  TokenServiceBindings,
  TokenServiceConstant,
} from './keys';
import {UserPermissionsProvider} from './providers';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // register authentication & authorization component
    this.component(AuthenticationComponent);
    this.bind('authorizationProvider.my-authorization-provider')
      .toProvider(MyAuthorizer)
      .tag(AuthorizationTags.AUTHORIZER);

    // Bind jwt & permissions component related elements
    registerAuthenticationStrategy(this, JWTStrategy);
    this.bind(MyAuthBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(MyAuthBindings.USER_PERMISSIONS).toProvider(
      UserPermissionsProvider,
    );
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstant.TOKEN_SECRET_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRE).to(
      TokenServiceConstant.TOKEN_EXPIRE_IN_VALUE,
    );

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
