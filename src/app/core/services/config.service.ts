import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config } from '../models/config';
import { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';
import { KeycloakOptions } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _config: Config;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<Config> {
    const configUrl = environment.production
      ? './assets/config/config.prod.json'
      : './assets/config/config.dev.json';
    return this.http.get(configUrl).pipe(
      map((config) => {
        this._config = config as Config;
        return this._config;
      }),
    );
  }

  getConfig(): Config {
    if (!this._config) {
      throw new Error('Configuration is not loaded');
    }

    return this._config;
  }

  getBackendApi() {
    if (!this._config) {
      throw new Error('Configuration is not loaded');
    }

    return `${this._config.backend.url}/api`;
  }

  getGeoserverUrl() {
    if (!this._config) {
      throw new Error('Configuration is not loaded');
    }

    return `${this._config.geoserver.url}/geoserver`;
  }

  keycloakInitOptions: KeycloakInitOptions = {
    onLoad: 'login-required',
    checkLoginIframe: false,
    enableLogging: true,
  };

  keycloakOptions = (config: KeycloakConfig): KeycloakOptions => {
    return {
      config: config,
      initOptions: this.keycloakInitOptions,
      enableBearerInterceptor: true,
    };
  };

  getKeycloakOptions(): KeycloakOptions {
    if (!this._config) {
      throw new Error('Configuration is not loaded');
    }
    return this.keycloakOptions(this._config.keycloak);
  }
}
