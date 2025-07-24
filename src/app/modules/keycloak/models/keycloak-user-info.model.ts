import {KeycloakResourceAccess, KeycloakRoles, KeycloakTokenParsed} from "keycloak-js";

export class KeycloakUserInfo {
  exp: number;
  iat: number;
  authTime: number;
  jti: string;
  iss: string;
  sub: string;
  typ: string;
  azp: string;
  nonce: string;
  sessionState: string;
  acr: string;
  realmAccess?: KeycloakRoles;
  resourceAccess?: KeycloakResourceAccess;
  scope: string;
  sid: string;
  emailVerified: boolean;
  preferredUsername: string;
  givenName: string;
  familyName: string;
  email: string;
  discriminator: string;

  constructor(obj?: KeycloakTokenParsed) {
    this.exp = (obj && obj.exp) || -1;
    this.iat = (obj && obj.iat) || -1;
    this.authTime = (obj && obj.auth_time) || -1;
    this.jti = (obj && obj.jti) || '';
    this.iss = (obj && obj.iss) || '';
    this.sub = (obj && obj.sub) || '';
    this.typ = (obj && obj.typ) || '';
    this.azp = (obj && obj.azp) || '';
    this.nonce = (obj && obj.nonce) || '';
    this.sessionState = (obj && obj.session_state) || '';
    this.acr = (obj && obj.acr) || '';
    this.realmAccess = obj && obj.realm_access;
    this.resourceAccess = obj && obj.resource_access;
    this.scope = (obj && obj.scope) || '';
    this.sid = (obj && obj.sid) || '';
    this.emailVerified = (obj && obj.email_verified) || true;
    this.preferredUsername = (obj && obj.preferred_username) || '';
    this.givenName = (obj && obj.given_name) || '';
    this.familyName = (obj && obj.family_name) || '';
    this.email = (obj && obj.email) || '';
    this.discriminator = (obj && obj.discriminator) || '';
  }
}

export type UserRole = 'manager' | 'viewer';
