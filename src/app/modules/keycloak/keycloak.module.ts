import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from 'src/app/_metronic/layout/core/rest/error-interceptor';
import { RequestInterceptor } from 'src/app/_metronic/layout/core/rest/request-interceptor';
import { TokenService } from './services/token.service';
import { ConfigService } from '../../core/services/config.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, KeycloakAngularModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, TokenService, ConfigService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
  ],
})
export class AuthKeycloakModule {}

function initializeKeycloak(
  keycloak: KeycloakService,
  token: TokenService,
  configService: ConfigService,
) {
  return () =>
    configService.loadConfig().subscribe({
      next: () => {
        keycloak.init(configService.getKeycloakOptions()).then(() => {
          token.doAfterLogin().subscribe();
        });
      },
    });
}
