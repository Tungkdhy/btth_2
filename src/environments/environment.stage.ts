// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Add here your keycloak configuration information
import { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';
import { KeycloakOptions } from 'keycloak-angular';

const BACKEND = {
  PROTOCOL: 'http',
  HOST: '192.168.43.191',
  PORT: 8080,
};

const KEYCLOAK = {
  PROTOCOL: 'http',
  HOST: '192.168.43.194',
  PORT: 8050,
  REALM: 'btl86',
  CLIENT_ID: 'menu_mgis',
};

const GEOSERVER = {
  PROTOCOL: 'http',
  HOST: '192.168.43.193',
  PORT: 80,
};

export const CONFIG = {
  BACKEND: `${BACKEND.PROTOCOL}://${BACKEND.HOST}:${BACKEND.PORT}/backend`,
  SESSION_EXPIRED: 3000,
  IDLE_TIMEOUT: 30,
  ALERT_INTERVAL: 30,
  KEYCLOAK: `${KEYCLOAK.PROTOCOL}://${KEYCLOAK.HOST}:${KEYCLOAK.PORT}`,
  GEOSERVER: `${GEOSERVER.PROTOCOL}://${GEOSERVER.HOST}:${GEOSERVER.PORT}/geoserver`,
};

const keycloakConfig: KeycloakConfig = {
  url: CONFIG.KEYCLOAK,
  realm: KEYCLOAK.REALM,
  clientId: KEYCLOAK.CLIENT_ID,
};

const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: 'login-required',
  checkLoginIframe: false,
};

export const keycloakOptions: KeycloakOptions = {
  config: keycloakConfig,
  initOptions: keycloakInitOptions,
  enableBearerInterceptor: true,
};

export const environment = {
  production: false,
  appVersion: 'v8.1.8',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
