import { KeycloakConfig } from 'keycloak-js';

export interface Config {
  backend: {
    url: string;
  };
  keycloak: KeycloakConfig;
  geoserver: {
    url: string;
  };
}
