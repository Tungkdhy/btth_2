import { KeycloakRoleModel } from './keycloak-role.model';

export interface KeycloakMappingModel {
  realmMappings: KeycloakRoleModel[];
  clientMappings?: KeycloakRoleModel[];
}
