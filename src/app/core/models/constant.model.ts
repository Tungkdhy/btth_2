export interface KeycloakUrls {
  USER: {
    GET_USERS: string;
    COUNT_USERS: string;
    GET_USER_BY_ID: (id: string) => string;
    RESET_PASSWORD: (id: string) => string;
    GET_GROUPS_IN_USER: (id: string) => string;
    UPDATE_GROUP_IN_USER: (userId: string, groupId: string) => string;
    GET_ROLE_MAPPINGS_IN_USER: (userId: string) => string;
    GET_REALM_ROLES_AVAILABLE_IN_USER: (userId: string) => string;
    UPDATE_REALM_ROLE_IN_USER: (userId: string) => string;
  };
  GROUP: {
    GET_GROUPS: string;
    COUNT_GROUPS: string;
    GET_GROUP_BY_ID: (id: string) => string;
    CREATE_CHILD_GROUP_BY_ID: (id: string) => string;
    GET_MEMBERS_BY_ID: (id: string) => string;
    INIT_GROUPS: string;
  };
}

export interface UnitUrls {
  DEVICES: {
    COUNT: (id: string) => string;
  };
  COORDINATES: {
    CHILDREN: (id: string) => string;
  };
  GET_TREE_ALL: string;
  UPDATE_COORDINATES: string;
}

export interface FmsUrls {
  ENDPOINT: {
    SEARCH: string;
    GET_BY_MAC: (mac: string) => string;
    SEARCH_BY_LIST_MAC: string;
    COUNT: (id: string) => string;
    GET_STATISTICS_BY_UNIT_ID: (unitId: string) => string;
  };
  ALERT: {
    SEARCH: (id: string) => string;
    COUNT: (id: string) => string;
    COUNT_MAC: (id: string) => string;
  };
  DISCONNECTED_SERVERS: string;
}

export interface AttachmentsUrls {
  GET_IMAGE_BY_ID: (id: string) => string;
}

export interface AlertConfigurationUrls {
  GET_LIST: string;
  CREATE: string;
  UPDATE: (id: string) => string;
  DELETE: (id: string) => string;
  GET_ALERT: string;
}

export interface DevicesUrls {
  UNITS: {
    GET_VENDOR_STATISTICS_BY_UNIT_ID: (unitId: string) => string;
    GET_MODEL_STATISTICS_BY_UNIT_ID_AND_VENDOR: (
      unitId: string,
      vendor: string,
    ) => string;
  };
  GET_BY_SERIAL_NUMBER: string;
  GET_LIST_BY_PARENT_ID: string;
}

export interface NacUrls {
  DISCONNECTED_SERVERS: string;
  BLOCK_CONNECTION: string;
  CONTROL: string;
}

export interface RuleUrls {
  GET: string;
  CREATE: string;
  UPDATE: (id: string) => string;
  DELETE: (id: string) => string;
}

export interface WebhookUrls {
  VIOLATION_ENDPOINTS: string;
  AUTO_BLOCK: string;
}

export interface LogsUrls {
  GET: string;
  CREATE: string;
  UPDATE: (id: string) => string;
  DELETE: (id: string) => string;
}

export interface RefUrls {
  DEVICE: {
    NAC: string;
    PRTG: string;
  };
  ENDPOINT: {
    NAC: string;
    FMS: string;
    TA21: string;
  };
  UNIT: {
    TA21: string;
    NMS: string;
    FMS: string;
  };
}

export interface PublicUrls {
  UNIT: {
    MGIS: string;
    TA21: {
      GET_ALL: string;
      GET_BY_ID: (id: string) => string;
    };
    NMS: {
      GET_ALL: string;
      GET_BY_ID: (id: string) => string;
    };
    FMS: {
      GET_ALL: string;
      GET_BY_ID: (id: string) => string;
    };
  };
  SERVER: {
    GET: string;
  };
}

export interface UrlsModel {
  KEYCLOAK: KeycloakUrls;
  UNIT: UnitUrls;
  FMS: FmsUrls;
  ATTACHMENTS: AttachmentsUrls;
  ALERT_CONFIGURATION: AlertConfigurationUrls;
  DEVICE: DevicesUrls;
  NAC: NacUrls;
  RULE: RuleUrls;
  WEBHOOK: WebhookUrls;
  LOGS: LogsUrls;
  REF: RefUrls;
  PUBLIC: PublicUrls;
}
