export interface KeycloakUserModel {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
}

export interface KeycloakUserPasswordModel {
  temporary: boolean;
  type: string;
  value: string;
}
