import {
  AlertConfigurationUrls,
  AttachmentsUrls,
  DevicesUrls,
  FmsUrls,
  KeycloakUrls,
  LogsUrls,
  NacUrls,
  PublicUrls,
  RefUrls,
  RuleUrls,
  UnitUrls,
  UrlsModel,
  WebhookUrls,
} from '../models/constant.model';
import { EventFMSModel } from '../models/fms.model';
import { CONFIG } from '../../../environments/environment';
// import { routerSvg } from '../../modules/topology/components/diagram-topology/diagram-svgs/router-svg';
// import { firewallSvg } from '../../modules/topology/components/diagram-topology/diagram-svgs/firewall-svg';
// import { switchSvg } from '../../modules/topology/components/diagram-topology/diagram-svgs/switch-svg';
import {
  LayerIds,
  REGION,
} from '../../modules/dashboard/models/btth.interface';
import { calculateDateTimeRange } from '../../_metronic/layout/core/common/common-utils';

export class Constant {
  // public static API_ENDPOINT = CONFIG.BACKEND + '/api';

  public static SESSION_EXPIRED = CONFIG.SESSION_EXPIRED || 30 * 60;

  public static TODAY = calculateDateTimeRange();
  // public static IDLE_TIMEOUT = CONFIG.IDLE_TIMEOUT || 30;

  public static TIMER = {
    SESSION_EXPIRED: CONFIG.SESSION_EXPIRED || 30 * 60,
    IDLE_TIMEOUT: CONFIG.IDLE_TIMEOUT || 30,
    ALERT_INTERVAL: (CONFIG.ALERT_INTERVAL || 30) * 1000,
  };

  public static SUPABASE = CONFIG.SUPABASE;
  public static BACKEND = CONFIG.API.BACKEND;

  public static MAX_OFFLINE_DAYS = 5;
  public static MAX_Z_INDEX = 9999;

  public static PAGE_ROLES = {
    MAP: {
      DEFAULT: 'ban-do',
      DIGITAL_MAP: 'ban-do-hanh-chinh',
      TOPOLOGY_MAP: 'ban-do-cau-truc-mang',
    },
    DEVICE_MANAGEMENT: {
      NETWORK_RECORD: 'ho-so-mang',
      NETWORK_DEVICE: 'thiet-bi-mang',
      ROUTER: 'thiet-bi-dinh-tuyen',
      SWITCH: 'thiet-bi-chuyen-mach',
      FIREWALL: 'tuong-lua',
      SERVER: 'may-chu',
      CLIENT: 'may-tram',
    },
  };
  public static REALM_ROLES = {
    MANAGER: 'manager',
    VIEWER: 'viewer',
    CENTRAL_COMMITTEE_MANAGER: '3vp_manager',
  };

  public static TYPE_DEVICE = {
    ROUTER: 'ROUTER',
    SWITCH: 'SWITCH',
    FIREWALL: 'FIREWALL',
    SERVER: 'SERVER',
    CLIENT: 'CLIENT',
    POS: 'POS',
  };

  public static CATEGORY_ROUTER = {
    BCTT: 'ROUTER_BCTT',
    CY: 'ROUTER_CY',
  };

  public static STORAGE_KEY = {
    UNIT_TREE: 'units',
    CURRENT_UNIT: 'currentUnit',
    DEVICE_TYPE: 'deviceType',
  };

  public static LABLES = {
    CARD: {
      BRIEF: {
        ROUTER: 'Định tuyến',
        SWITCH: 'Chuyển mạch',
        FIREWALL: 'Tường lửa',
        SERVER: 'Máy chủ',
        CLIENT: 'Máy trạm',
        COMPUTER: 'Máy tính',
        PHOTOCOPY: 'Máy photocopy/ Máy in',
        OTHERS: 'Chưa định danh',
      },
      FULLNAME: {
        ROUTER: 'Thiết bị định tuyến',
        SWITCH: 'Thiết bị chuyển mạch',
        FIREWALL: 'Tường lửa',
        SERVER: 'Máy chủ',
        CLIENT: 'Máy trạm',
        COMPUTER: 'Máy tính',
        PHOTOCOPY: 'Máy photocopy/ Máy in',
        OTHERS: 'Thiết bị chưa định danh',
      },
    },
  };

  public static USER = {
    GET_USER_BY_TOKEN: '/user/login/tk',
    GET_LIST_USER_BY_TEXT: '/users/findUserByName',
    GET_LIST_USER: '/users/findUser',
    GET_DETAIL_USER: '/users/findByUserId',
    ADD_USER: '/users/addUser',
    UPDATE_USER: '/users/update',
    FIND_FOR_EXCEL: '/users/findUser?',
    IMPORT_EXCEL: '/users/registry-excel',
    IMPORT_VIEW: '/users/importView',
    IMPORT_DATA: '/users/importUser',
    EXPORT_WORD: '/users/export-user-word',
    EXPORT_EXCEL: '/users/export-user-excel',
    DELETE: '/users/delete/',
    ACTIVE: '/users/active/',
    DEACTIVE: '/users/deactive/',
    SHOW_PDF_USERS: '/users/showPDF',
    CHANGE_PW_BY_ADMIN: '/users/changePassword',
    SEARCH_USER_ORG: '/users/all-user-in-org',
  };

  public static MENU = {
    SYSTEM: 'Hệ thống',
    UNIT: 'Đơn vị',
    SYNCHRONIZATION: 'Đồng bộ',
    MONITORING_SYSTEM: 'Hệ thống giám sát',
    ALERT: 'Cảnh báo',
    GROUP: 'Nhóm',
    USER: 'Người dùng',
    COORDINATE: 'Tọa độ',
    ALERT_CONFIGURATION: 'Cấu hình cảnh báo',

    MAP: 'Bản đồ',
    MILITARY_MAP: 'Bản đồ hành chính',
    TOPOLOGY_MAP: 'Bản đồ cấu trúc mạng',
    COMMAND_AUTOMATION: 'Tự động hóa chỉ huy',
    COMPARE_HTGS: 'Đối chiếu HTGS',
    REFERENCE_DEVICE: 'Ánh xạ thiết bị',

    DEVICE_MANAGEMENT: 'Hồ sơ mạng',
    DEVICE: 'Thiết bị mạng',
    ROUTER: 'Thiết bị định tuyến',
    SWITCH: 'Thiết bị chuyển mạch',
    FIREWALL: 'Tường lửa',
    ENDPOINT: 'Máy tính',
    SERVER: 'Máy chủ',
    CLIENT: 'Máy trạm',

    STATISTIC: 'Thống kê',
    DEVICE_STATUS: 'Tình trạng thiết bị',
    MONITORING_SERVER: 'Máy chủ giám sát',
    REFERENCE_STATISTICS: 'Ánh xạ',
    REFERENCE_UNIT_STATISTICS: 'Đơn vị',
    REFERENCE_DEVICE_STATISTICS: 'Thiết bị',

    DYNAMIC_DEFINITION: 'Định nghĩa động',
    VIOLATED_ENDPOINTS: 'Thiết bị vi phạm',
    ACTION_LOGS: 'Nhật ký hoạt động',

    TOOLS: 'Công cụ',
    SYSTEM_MONITORING_TOOLS: 'Hệ thống giám sát',
    TA21: 'ta21',
    WAFS: 'wafs',
    SYSMONITORING_MANAGEMENT_TOOLS: 'Quản lý',
    SYSMONITORING_STATISTIC_TOOLS: 'Thống kê',
  };

  private static readonly BASE_KEYCLOAK_URL = '/keycloak';
  private static readonly BASE_KEYCLOAK_USERS_URL = `${this.BASE_KEYCLOAK_URL}/users`;
  private static readonly BASE_KEYCLOAK_GROUPS_URL = `${this.BASE_KEYCLOAK_URL}/groups`;
  private static readonly BASE_UNIT_URL = '/unit';
  private static readonly BASE_UNIT_FMS = '/fms';
  private static readonly BASE_UNIT_ATTACHMENTS = '/attachments';
  private static readonly BASE_DEVICE = '/network-device';
  private static readonly BASE_ALERT_CONFIGURATION = '/alert-filter';
  private static readonly BASE_NAC = '/nac';
  private static readonly BASE_RULE = '/rule';
  private static readonly BASE_WEBHOOK = '/webhook';
  private static readonly BASE_ACTION_LOGS = '/log';
  private static readonly BASE_REF = '/ref';
  private static readonly BASE_PUBLIC = '/public';

  private static readonly KEYCLOAK_URLS: KeycloakUrls = {
    USER: {
      GET_USERS: Constant.BASE_KEYCLOAK_USERS_URL,
      COUNT_USERS: `${Constant.BASE_KEYCLOAK_USERS_URL}/count`,
      GET_USER_BY_ID: (id: string) =>
        `${Constant.BASE_KEYCLOAK_USERS_URL}/${id}`,
      RESET_PASSWORD: (id: string) =>
        `${Constant.URLS.KEYCLOAK.USER.GET_USER_BY_ID(id)}/reset-password`,
      GET_GROUPS_IN_USER: (userId: string) =>
        `${Constant.BASE_KEYCLOAK_USERS_URL}/${userId}/groups`,
      UPDATE_GROUP_IN_USER: (userId: string, groupId: string) =>
        `${Constant.URLS.KEYCLOAK.USER.GET_GROUPS_IN_USER(userId)}/${groupId}`,
      GET_ROLE_MAPPINGS_IN_USER: (userId: string) =>
        `${Constant.BASE_KEYCLOAK_USERS_URL}/${userId}/role-mappings`,
      GET_REALM_ROLES_AVAILABLE_IN_USER: (userId: string) =>
        `${Constant.URLS.KEYCLOAK.USER.GET_ROLE_MAPPINGS_IN_USER(
          userId,
        )}/realm/available`,
      UPDATE_REALM_ROLE_IN_USER: (userId: string) =>
        `${Constant.URLS.KEYCLOAK.USER.GET_ROLE_MAPPINGS_IN_USER(
          userId,
        )}/realm`,
    },
    GROUP: {
      GET_GROUPS: Constant.BASE_KEYCLOAK_GROUPS_URL,
      COUNT_GROUPS: `${Constant.BASE_KEYCLOAK_GROUPS_URL}/count`,
      GET_GROUP_BY_ID: (groupId: string) =>
        `${Constant.BASE_KEYCLOAK_GROUPS_URL}/${groupId}`,
      CREATE_CHILD_GROUP_BY_ID: (groupId: string) =>
        `${Constant.URLS.KEYCLOAK.GROUP.GET_GROUP_BY_ID(groupId)}/children`,
      GET_MEMBERS_BY_ID: (groupId: string) =>
        `${Constant.URLS.KEYCLOAK.GROUP.GET_GROUP_BY_ID(groupId)}/members`,
      INIT_GROUPS: `${Constant.BASE_KEYCLOAK_GROUPS_URL}/init`,
    },
  };

  private static readonly UNIT_URLS: UnitUrls = {
    DEVICES: {
      COUNT: (unitId) => `${Constant.BASE_UNIT_URL}/${unitId}/devices/count`,
    },
    COORDINATES: {
      CHILDREN: (unitId) =>
        `${Constant.BASE_UNIT_URL}/${unitId}/coordinates/children`,
    },
    GET_TREE_ALL: `${Constant.BASE_UNIT_URL}/get-tree-all`,
    UPDATE_COORDINATES: `${Constant.BASE_UNIT_URL}/update-coordinates-info`,
  };

  private static readonly FMS_URLS: FmsUrls = {
    ENDPOINT: {
      SEARCH: `${Constant.BASE_UNIT_FMS}/endpoints`,
      GET_BY_MAC: (mac: string) => `${Constant.BASE_UNIT_FMS}/endpoints/${mac}`,
      SEARCH_BY_LIST_MAC: `${Constant.BASE_UNIT_FMS}/endpoints/mac`,
      COUNT: (id: string) =>
        `${Constant.BASE_UNIT_FMS}/units/${id}/endpoints/count`,
      GET_STATISTICS_BY_UNIT_ID: (unitId: string) =>
        `${Constant.BASE_UNIT_FMS}/units/${unitId}/endpoints/statistics`,
    },
    ALERT: {
      SEARCH: (id: string) => `${Constant.BASE_UNIT_FMS}/units/${id}/alerts`,
      COUNT: (id: string) =>
        `${Constant.BASE_UNIT_FMS}/units/${id}/alerts/count`,
      COUNT_MAC: (id: string) =>
        `${Constant.BASE_UNIT_FMS}/units/${id}/alerts/count-mac`,
    },
    DISCONNECTED_SERVERS: `${Constant.BASE_UNIT_FMS}/disconnected-servers`,
  };

  private static readonly ATTACHMENTS_URLS: AttachmentsUrls = {
    GET_IMAGE_BY_ID: (id: string) => `${Constant.BASE_UNIT_ATTACHMENTS}/${id}`,
  };

  private static readonly ALERT_CONFIGURATION_URLS: AlertConfigurationUrls = {
    GET_LIST: `${Constant.BASE_ALERT_CONFIGURATION}`,
    CREATE: `${Constant.BASE_ALERT_CONFIGURATION}`,
    UPDATE: (id: string) => `${Constant.BASE_ALERT_CONFIGURATION}/${id}`,
    DELETE: (id: string) => `${Constant.BASE_ALERT_CONFIGURATION}/${id}`,
    GET_ALERT: `${Constant.BASE_ALERT_CONFIGURATION}/alerts`,
  };

  private static readonly DEVICE_URLS: DevicesUrls = {
    UNITS: {
      GET_VENDOR_STATISTICS_BY_UNIT_ID: (unitId: string) =>
        `${Constant.BASE_DEVICE}/units/${unitId}/vendors/statistics`,
      GET_MODEL_STATISTICS_BY_UNIT_ID_AND_VENDOR: (
        unitId: string,
        vendor: string,
      ) =>
        `${Constant.BASE_DEVICE}/units/${unitId}/vendors/${vendor}/models/statistics`,
    },
    GET_BY_SERIAL_NUMBER: `${Constant.BASE_DEVICE}/get`,
    GET_LIST_BY_PARENT_ID: `${Constant.BASE_DEVICE}/get-network-device-by-parent-id`,
  };

  private static readonly NAC_URLS: NacUrls = {
    DISCONNECTED_SERVERS: `${Constant.BASE_NAC}/disconnected-servers`,
    BLOCK_CONNECTION: `${Constant.BASE_NAC}/endpoint-status`,
    CONTROL: `${Constant.BASE_NAC}/control`,
  };

  private static readonly RULE_URLS: RuleUrls = {
    GET: `${Constant.BASE_RULE}`,
    CREATE: `${Constant.BASE_RULE}`,
    UPDATE: (id: string) => `${Constant.BASE_RULE}/${id}`,
    DELETE: (id: string) => `${Constant.BASE_RULE}/${id}`,
  };

  private static readonly WEBHOOK_URLS: WebhookUrls = {
    VIOLATION_ENDPOINTS: `${Constant.BASE_WEBHOOK}/endpoints/violation`,
    AUTO_BLOCK: `${Constant.BASE_WEBHOOK}/automation-block`,
  };

  private static readonly LOGS_URLS: LogsUrls = {
    GET: `${Constant.BASE_ACTION_LOGS}`,
    CREATE: `${Constant.BASE_ACTION_LOGS}`,
    UPDATE: (id: string) => `${Constant.BASE_ACTION_LOGS}/${id}`,
    DELETE: (id: string) => `${Constant.BASE_ACTION_LOGS}/${id}`,
  };

  private static readonly REF_URLS: RefUrls = {
    DEVICE: {
      NAC: `${Constant.BASE_REF}/device/nac`,
      // PRTG: `${Constant.BASE_REF}/device/prtg`,
      PRTG: `${Constant.BASE_REF}/device/prtg2`,
    },
    ENDPOINT: {
      NAC: `${Constant.BASE_REF}/endpoint/nac`,
      FMS: `${Constant.BASE_UNIT_FMS}/endpoints`,
      TA21: `${Constant.BASE_REF}/endpoint/ta21`,
    },
    UNIT: {
      TA21: `${Constant.BASE_REF}/unit/ta21`,
      NMS: `${Constant.BASE_REF}/unit/nms`,
      FMS: `${Constant.BASE_REF}/unit/fms`,
    },
  };

  private static readonly PUBLIC_URLS: PublicUrls = {
    UNIT: {
      MGIS: `${Constant.BASE_PUBLIC}/unit`,
      TA21: {
        GET_ALL: `${Constant.BASE_PUBLIC}/unit-ta21`,
        GET_BY_ID: (id: string) => `${Constant.BASE_PUBLIC}/unit-ta21/${id}`,
      },
      NMS: {
        GET_ALL: `${Constant.BASE_PUBLIC}/unit-nms`,
        GET_BY_ID: (id: string) => `${Constant.BASE_PUBLIC}/unit-nms/${id}`,
      },
      FMS: {
        GET_ALL: `${Constant.BASE_PUBLIC}/unit-fms`,
        GET_BY_ID: (id: string) => `${Constant.BASE_PUBLIC}/unit-fms/${id}`,
      },
    },
    SERVER: {
      GET: `${Constant.BASE_PUBLIC}/server`,
    },
  };

  public static URLS: UrlsModel = {
    KEYCLOAK: this.KEYCLOAK_URLS,
    UNIT: this.UNIT_URLS,
    FMS: this.FMS_URLS,
    ATTACHMENTS: this.ATTACHMENTS_URLS,
    ALERT_CONFIGURATION: this.ALERT_CONFIGURATION_URLS,
    DEVICE: this.DEVICE_URLS,
    NAC: this.NAC_URLS,
    RULE: this.RULE_URLS,
    WEBHOOK: this.WEBHOOK_URLS,
    LOGS: this.LOGS_URLS,
    REF: this.REF_URLS,
    PUBLIC: this.PUBLIC_URLS,
  };

  public static DEFAULT = {
    PAGING: {
      PAGE: 0,
      SIZE: 10,
    },
    COLORS: {
      ALERTS: {
        NETWORK: [245, 166, 35],
        INFO_SEC: [255, 76, 76],
      },
    },
    MAP: {
      GEOSERVER: {
        LAYERS: {
          OSM_MAP: 'osm:osm',
          MILITARY_MAP_1M: 'osm:military-1',
          MILITARY_MAP_250: 'osm:military-2',
          MILITARY_MAP_100: 'osm:military-3',
          VIETNAM_FINAL: 'osm:vietnam-final',
          VIETNAM_ALL: 'osm:vietnam-all',
          VIETNAM_MOSAIC: 'osm:vietnam-mosaic',
          INFO_LAYER: 'osm:info_layer',
          CABLE_MILITARY: 'osm:military_cable_86',
          SEA_CABLE: 'osm:sea_cable',

          // Military
          MILITARY_REGION: 'osm:military_region',
          BACKBONE_NODES: 'osm:backbone_nodes',
          CABLE_QA: 'osm:qa_route',
          CABLE_QB: 'osm:qb_route',
          CABLE_QC: 'osm:qc_route',
          MILITARY_BRANCH_LINE: 'osm:military_branch_line',

          // Administration
          COMMUNE: 'osm:commune',
          DISTRICT: 'osm:district',
          PROVINCE: 'osm:province',
          NATION: 'osm:nation',

          // Internet
          AAE_CABLE: 'osm:aae_cable',
          AAG_CABLE: 'osm:aag_cable',
          ADC_CABLE: 'osm:adc_cable',
          APG_CABLE: 'osm:apg_cable',
          SJC2_CABLE: 'osm:sjc2_cable',
          SMW3_CABLE: 'osm:smw3_cable',
          TGN_CABLE: 'osm:tgn_cable',
          AGGREGATION_ROUTES: 'osm:aggregation_routes',
          CABLE_LANDING_STATIONS: 'osm:cable_landing_stations',
          FIBER_CABLE_TO_CHINA: 'osm:fiber_cable_to_china',
          FIBER_CABLE_TO_CAMPUCHIA: 'osm:fiber_cable_to_campuchia',
          FIBER_CABLE_TO_LAOS: 'osm:fiber_cable_to_laos',

          // Trạm
          FIBER_OPTIC_STATION: 'osm:fiber_optic_station',
          SWITCHING_STATION: 'osm:switching_station',
          VIBA_STATION: 'osm:viba_station',
          BTS_STATION: 'osm:bts_station',
          // Tuyến
          VIBA_ROUTE: 'osm:viba_route',
          VIETTEL_ROUTE: 'osm:viettel_route',
          VIETTEL_LAOS_ROUTE: 'osm:fiber_cable_to_laos',
          VIETTEL_CAMPUCHIA_ROUTE: 'osm:fiber_cable_to_campuchia',
          VIETTEL_CHINA_ROUTE: 'osm:fiber_cable_to_china',
        },
      },
      LAYERS: {
        CORE: {
          name: 'core',
          trans: 'Lõi',
        },
        BOUNDARY: {
          name: 'boundary',
          trans: 'Biên',
        },
        ACCESS: {
          name: 'access',
          trans: 'Truy cập',
        },
        CABLE_QA: 'qa',
        CABLE_QB: 'qb',
        CABLE_QC: 'qc',
      },
      VIEW: {
        LATITUDE: 112.2015,
        LONGITUDE: 16.256,
        ZOOM_LEVEL: 5,
      },
      ZOOM_LEVEL: {
        CORE: {
          MIN: 6,
          MAX: 12,
        },
        BOUNDARY: {
          MIN: 12,
          MAX: 14,
        },
        ACCESS_LEVEL_3: {
          MIN: 14,
          MAX: 16,
        },
        ACCESS_LEVEL_4: {
          MIN: 16,
          MAX: 18,
        },
        ACCESS_LEVEL_5: {
          MIN: 18,
          MAX: 20,
        },
      },
      ICON_SIZE: {
        PINLET: {
          WIDTH: 30,
          HEIGHT: 40,
        },
        DOT: {
          WIDTH: 30,
          HEIGHT: 30,
        },
        FLAG: {
          WIDTH: 90, // Increased from 70 to 100
          HEIGHT: 90, // Increased from 70 to 100
        },
        FLAG_SMALL: {
          WIDTH: 40, // Increased from 70 to 100
          HEIGHT: 40, // Increased from 70 to 100
        },
        FLAG_IN_MAP: {
          WIDTH: 40,
          HEIGHT: 40,
        },
      },
      PROPERTIES: {
        NETWORK: 'network',
        INFO_SEC: 'infoSec',
      },
    },
    COORDINATES: {
      LAT: 21.023298220348806,
      LON: 105.84968495903955,
      LAT_ZOOM_CENTER: 21.033281591791265,
      LON_ZOOM_CENTER: 105.8666553055242,
      ZOOM_LEVEL: 11,
      ROTATION_X: 1,
      ROTATION_Y: 0.94,
    },
    ICON: {
      ROUTER: './assets/media/svg/network-device/router-device.svg',
      SWITCH: './assets/media/svg/network-device/switch-device.svg',
      FIREWALL: './assets/media/svg/network-device/firewall-device.svg',
      ALERT: {
        RED: 'assets/images/bigdot-red.svg',
        BLUE: 'assets/images/bigdot-blue.svg',
        YELLOW: 'assets/images/bigdot-yellow.svg',
        GREEN: 'assets/images/bigdot-green.svg',
        WHITE: 'assets/images/bigdot-white.svg',
      },
    },
    TCM: {
      TT1: './assets/media/svg/tcm/qs.t1.svg',
      TT2: './assets/media/svg/tcm/qs.t2.svg',
      TT3: './assets/media/svg/tcm/qs.t3.svg',
      TT5: './assets/media/svg/tcm/qs.t5.svg',
      CMF1: './assets/media/svg/tcm/qs.cmf1.svg',
      CMF2: './assets/media/svg/tcm/qs.cmf2.svg',
      CMF3: './assets/media/svg/tcm/qs.cmf3.svg',
      MD: './assets/media/svg/tcm/qs.md.svg',
      TC: './assets/media/svg/tcm/qs.tc.svg',
      TS: './assets/media/svg/tcm/qs.ts.svg',
      LOCATION: './assets/media/svg/tcm/location.svg',
      ACCEPT: './assets/media/svg/tcm/accept.svg',
      REJECT: './assets/media/svg/tcm/reject.svg',
      RIPPLE: './assets/media/svg/tcm/ripple.svg',
    },
  };

  public static DEFAULT_VALUES = {
    UNDEFINED_NAME: 'unknown',
    NULL_VALUE: 'empty',
    REGION: [
      {
        name: 'Khu vực',
        value: 'all',
      },
      {
        name: 'Miền Bắc',
        value: 'north',
      },
      {
        name: 'Miền Trung',
        value: 'central',
      },
      {
        name: 'Miền Nam',
        value: 'south',
      },
    ],
    ALERT: {
      INFRASTRUCTURE: 'Cảnh báo sự cố mất kết nối',
      INFOSEC: 'Cảnh báo sự cố mất an toàn thông tin',
    },
  };

  public static SYSTEM_ALERTS = [
    {
      name: 'Định tuyến',
      code: 'device_ROUTER_ROUTER_BCTT',
    },
    {
      name: 'Cơ yếu',
      code: 'device_ROUTER_ROUTER_CY',
    },
    {
      name: 'Chuyển mạch',
      code: 'device_SWITCH_',
    },
    {
      name: 'Tường lửa',
      code: 'device_FIREWALL_',
    },
    {
      name: 'Máy chủ',
      code: 'device_SERVER_',
    },
    {
      name: 'HTGS FMC',
      code: 'server_monitor',
    },
    {
      name: 'Cổng TTĐT',
      code: 'service_PORTAL',
    },
    {
      name: 'Dùng chung',
      code: 'service_COMMON',
    },
  ];

  public static SECURITY_ALERTS = [
    {
      name: 'Mã độc',
      code: 'MALWARE',
    },
    {
      name: 'Tên miền độc hại',
      code: 'BLACK_DOMAIN',
    },
    {
      name: 'Kết nối Internet',
      code: 'INTERNET',
    },
    {
      name: 'Bất thường',
      code: 'HUNTING',
    },
  ];

  public static KEYCLOAK = {
    GET_KEYCLOAK_USER: '/keycloak/getUserInfo',
    CHANGE_PASSWORD: '/keycloak/changePassword',
    GET_GROUPS: '/keycloak/groups',
    GET_GROUP_BY_ID: '/keycloak/groups/',

    // GET_USERS: '/keycloak/users',
    // COUNT_USERS: '/keycloak/users/count',
    // GET_USERS_BY_ID: '/keycloak/users/',
  };

  public static LICENSE_KEY =
    'Mgo+DSMBaFt9QHFqVk5rXVNbdV5dVGpAd0N3RGlcdlR1fUUmHVdTRHRcQlpiT3xSdUJiWHtacXc=;Mgo+DSMBPh8sVXJ2S0d+X1lPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXlScEdiWnhfcXBTRmM=;ORg4AjUWIQA/Gnt2V1hhQlJMfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5Ud0NhWHxZcXVRQWhf;MjU3ODI4MEAzMjMyMmUzMDJlMzBOYjhyYkpmOGw4MlpOM2tBUjNvcDVmUFVHN0dvdklOUURpODZuT0F6Vk8wPQ==;MjU3ODI4MUAzMjMyMmUzMDJlMzBSakltRC91T0l6TjJXY29lQldka21yMjdOdDJaMHdPQWVnSk81bHI1K3pRPQ==;NRAiBiAaIQQuGjN/V0R+XU9HflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TcURlW35dd3VUQ2ZbUg==;MjU3ODI4M0AzMjMyMmUzMDJlMzBpWDM3TEtiUEVhWjVycDNuaEoydWRpMjRFM2ZaVm5aZlBSVmJhQWhYTStRPQ==;MjU3ODI4NEAzMjMyMmUzMDJlMzBmUG9BdzBGdUpFOWgycWFQM29UeWozR0s5Sm5PdTJ5L2lwN08xa0ZYT0tjPQ==;Mgo+DSMBMAY9C3t2V1hhQlJMfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5Ud0NhWHxZcXVTQ2Zf;MjU3ODI4NkAzMjMyMmUzMDJlMzBuaXhDNHltK002OWUvVjVXd2FZVE10aDJrUGZ4b1I4TGFtMURUWHR2UGZZPQ==;MjU3ODI4N0AzMjMyMmUzMDJlMzBlQlV4ek9XSGZCOE5wZ1owc2VFZDhveFZET282RnNhYk5aazg0L2E3blpvPQ==;MjU3ODI4OEAzMjMyMmUzMDJlMzBpWDM3TEtiUEVhWjVycDNuaEoydWRpMjRFM2ZaVm5aZlBSVmJhQWhYTStRPQ==';

  public static ERROR_STATUS = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    INPUT_ERROR: 422,
    CONFLICT: 409,
  };

  public static DIRECTION = {
    ASC: 'ASC',
    DESC: 'DESC',
  };

  public static MESSAGE = {
    SUCCESS_ADD: 'Thêm mới thành công',
    SUCCESS_UPDATE: 'Cập nhật thành công',
    SUCCESS_DELETE: 'Xóa thành công',
    SUCCESS_ACCEPT: 'Duyệt thành công',
    SUCCESS_ASSIGN: 'Gán thành công',
    SUCCESS_RESET_PASSWORD: 'Thiết lập mật khẩu thành công',
    SUCCESS_TOGGLE_USER_STATUS: (status: boolean) =>
      status ? 'Vô hiệu hóa' : 'Kích hoạt' + ' thành công',

    ERROR_ADD: 'Thêm mới thất bại',
    ERROR_UPDATE: 'Cập nhật thất bại',
    ERROR_DELETE: 'Xóa thất bại',
    ERROR_GET: 'Lấy dữ liệu thất bại',
    ERROR_ACCEPT: 'Duyệt thất bại',
    ERROR_ASSIGN: 'Gán thất bại',
    ERROR_TOGGLE_USER_STATUS: (status: boolean) =>
      status ? 'Vô hiệu hóa' : 'Kích hoạt' + ' thất bại',

    WARNING_INVALID_INPUT: 'Thông tin nhập không hợp lệ',
    WARNING_UNSELECT_RECORD: 'Vui lòng chọn bản ghi',

    NOT_FOUND: 'ID không tồn tại',
    UNKNOWN: 'Không có tên',
  };

  public static API = {
    GET_ALL: '/api/getAll',
    SEARCH: '/api/search/',
    ADD: '/api/add',
    UPDATE: '/api/update/',
    ACTIVE: '/api/active/',
    DETAIL: '/api/detail/',
  };

  public static PAGING = {
    SIZE: 10,
    CURRENT_PAGE: 1,
    MAX_SIZE: 3,
    PREVIOUS: 'Trước',
    NEXT: 'Sau',
    ROTATE: true,
    SIZE_LIST: [10, 20, 50, 100],
  };

  public static UNIT = {
    GET_DETAIL: '/unit/get-detail/',
    GET_UNIT_DETAIL: '/network-device/get-unit-detail/', // FIXIT: fix lại api url
    FIND_BY_ID: '/unit/find-by-id/',
    FIND_ALL: '/unit/find-all',
    FIND_ALL_BY_TYPE: '/unit/find-all-by-type',
    GET_LIST_ORGS_BY_PARENT_UUID: '/unit/get-orgs-by-parent-uuid/',
    GET_TOTAL_DEVICE_BY_UNIT: '/unit/get-total-device-by-unit',
    GET_CHILDREN_CONTAIN_ITSELF: '/unit/get-children-contain-itself',
    GET_TREE: '/unit/get-tree/',
    GET_TREE_GRID: '/unit/get-tree-grid',
    GET_TREE_NOT_CONTAINS_ROOT: '/unit/get-tree-not-contains-root',
    GET_ORGANIZATION_TREE_BY_UNIT_ID: '/unit/get-organization-tree-by-unit-id/',
    INSERT_AS_LAST_CHILD_OF: '/unit/insert-as-last-child-of',
    UPDATE: '/unit/update/',
    DELETE: '/unit/delete/',
    REMOVE_SINGLE: '/unit/remove-single',
    REMOVE_SUBTREE: '/unit/remove-subtree',
    ADD: '/unit/add',

    TYPE_UNIT: 'UNIT',
    TYPE_ORGANIZATION: 'ORGANIZATION',
    DISCRIMINATOR_TSLQS: 'TSLQS',
    DISCRIMINATOR_INTERNET: 'INTERNET',
    // Unit Nested Set
    GET_ROOT_TREE: '/unit/get-root-tree',
    GET_TREE_NO_ROOT: '/unit/get-tree-no-root',
    MOVE_NODE: '/unit/move-node',
    GET_TREE_BY_ID: '/unit/get-tree-by-id',
    GET_TREE_BY_ID_AND_TYPE: '/unit/get-tree-by-id-and-type',
    GET_COORDINATES_INFO: '/unit/get-coordinates-info/',
    GET_COORDINATE: '/unit/get-coordinate/',
    UPDATE_COORDINATES_INFO: '/unit/update-coordinates-info',
  };

  public static NETWORK_DEVICE = {
    SEARCH: '/network-device/get-network-device-list',
    ADD: '/network-device/add',
    UPDATE: '/network-device/update/',
    GET_DETAIL: '/network-device/get/',
    GET_LIST: '/network-device/get-list/',
    GET_LIST_DTO: '/network-device/get-list-dto/',
    GET_LIST_HAS_SERIAL_NUMBER: '/network-device/get-list-has-sn',
    GET_LIST_BY_UNIT_ID_AND_TYPE: '/network-device/get-device-by-unit-id',
    GET_LIST_BY_UNIT_LIST_AND_TYPE:
      '/network-device/get-device-by-unit-list-and-type',
    GET_LIST_BY_PARENT_ID: '/network-device/get-network-device-by-parent-id',
    GET_LIST_BY_TREE: '/network-device/get-device-by-tree',
    GET_SENSOR_DEVICE_BY_PRTG: '/network-device/get-sensor-device-by-prtg',
    DELETE: '/network-device/delete/',
    HAS_SERIAL_NUMBER: '/network-device/has-serial-number/',
    GET_DEVICES_DOWN: '/network-device/get-device-down/',
  };

  public static COMPUTER = {
    SEARCH: '/computer/get-computer-list',
    ADD: '/computer/add',
    UPDATE: '/computer/update/',
    GET_BY_MAC: '/computer/get/',
    GET_LIST: '/computer/get-list',
    GET_LIST_VIRTUAL: '/computer/get-virtual-list/',
    GET_VIRTUAL_LIST_BY_UNIT_ID: '/computer/get-virtual-list-by-unit-id',
    GET_VIRTUAL_LIST_BY_DEVICE: '/computer/get-virtual-list-by-device-mac/',
    GET_COMPUTER_BY_TREE: '/computer/get-computer-by-tree',
    GET_LIST_BY_PARENT_ID: '/computer/get-computer-by-parent-id',
    GET_COMPUTER_BY_TREE_AND_TYPE: '/computer/get-computer-by-tree-and-type',
    GET_SENSOR_COMPUTER_BY_PRTG: '/computer/get-sensor-computer-by-prtg/',
    UPDATE_PHYSICAL_MAC: '/computer/update-physical-mac',
    DELETE: '/computer/delete/',
    DELETE_BY_MAC: '/computer/delete-by-mac/',
    BLOCK: '/computer/block',
    ALLOW: '/computer/allow',
    HAS_MAC: '/computer/has-mac/',
    REMOVE_VIRTUAL_COMPUTER: '/computer/remove-virtual-computer/',
  };

  public static REFERENCE = {
    SEARCH: '/reference/get-reference-list/',
    ADD: '/reference/add',
    UPDATE: '/reference/update/',
    GET_DETAIL: '/reference/get/',
    GET_LIST: '/reference/get-list',
    GET_LIST_BY_ORIGINAL_ID: '/reference/get-list-by-original-id/',
    GET_BY_DEVICE_UUID: '/reference/get-by-device-uuid',
    DELETE: '/reference/delete/',
  };

  public static TOPOLOGY = {
    GET_TOPOLOGY: '/topology/get-topology-by-unit-id',
    GET_NODES: '/topology/get-nodes/',
    SET_X_Y: '/topology/set-x-and-y-by-device-id',
  };

  public static PORT = {
    SEARCH: '/port/get-port-list',
    GET_LIST_PORT_SWITCH: '/port/get-port-list-switch',
    GET_COMPUTER_LIST_BY_PORT: '/port/get-computer-list-by-port/',
    ADD: '/port/add',
    UPDATE: '/port/update/',
    GET_DETAIL: '/port/get/',
    GET_LIST: '/port/get-list',
    GET_PORT_LIST: '/port/get-port-list',
    GET_BY_DEVICE_SN: '/port/get-by-device-sn/',
    GET_TRAFFIC_TOTAL: '/port/get-traffic-total',
    DELETE: '/port/delete/',
  };

  public static MONITORING_SYSTEM = {
    ADD: '/monitoring-system/add',
    UPDATE: '/monitoring-system/update/',
    GET_LIST: '/monitoring-system/get-list',
    DELETE: '/monitoring-system/delete/',
    GET_PAGING_LIST: '/monitoring-system/get-paging-list',
    GET_DETAIL: '/monitoring-system/get/',
  };

  public static FMS_ALERT = {
    ADD: '/fms/add',
    UPDATE: '/fms/update/',
    GET_LIST: '/fms/get-list',
    DELETE: '/fms/delete/',
    GET_PAGING_LIST: '/fms/get-paging-list',
    GET_DETAIL: '/fms/get/',
    GET_WARNING_BLACK_DOMAIN: '/fms/get-black-domain-today',
    GET_TOTAL_ALERT: '/fms/get-total-alert/',
    GET_LIST_BY_EVENT: '/fms/get-list-by-event',
    GET_ALERTS_BY_EVENT: '/fms/get-alerts-by-event',

    GET_COMPUTER_BY_PARENT_ID: '/fms/get-computer-by-parent-id',
    GET_OTHER_BY_PARENT_ID: '/fms/get-other-by-parent-id',
  };

  public static FMS = {
    GET_ALERT_COUNT_PER_UNIT: '/fms/get-alert-count-per-unit',
    GET_ALERT_DETAILS: '/fms/get-alert-details',
    COUNT_ENDPOINT_BY_PARENT_ID: '/fms/count-endpoint-by-unit-id/',
    GET_ENDPOINT_BY_PARENT_ID: '/fms/get-endpoint-by-parent-id',
  };

  public static NODE_COORDINATE = {
    SEARCH: '/node-coordinate/get-node-coordinate-list',
    ADD: '/node-coordinate/add',
    UPDATE: '/node-coordinate/update/',
    UPDATE_LIST: '/node-coordinate/update-list',
    GET_DETAIL: '/node-coordinate/get/',
    GET_LIST: '/node-coordinate/get-list/',
    GET_LIST_BY_NODE_ID: '/node-coordinate/get-list/',
    DELETE: '/node-coordinate/delete/',
  };

  // #Deprecated
  public static readonly SYNCHRONIZATION = {
    SEARCH: '/synchronization/search',
    ADD: '/synchronization/add',
    ACCEPT_RECORD: '/synchronization/accept-record',
    ACCEPT_RECORD_LIST: '/synchronization/accept-record-list',
    ACCEPT_BY_TABLE_LIST: '/synchronization/accept-by-table-list',
    ACCEPT_ALL_RECORD: '/synchronization/accept-all-record',
    HAS_INITIAL_RECORD: '/synchronization/has-initial-record',
    UPDATE: '/synchronization/update/',
    FIND_BY_ID: '/synchronization/find-by-id/',
    FIND_ALL: '/synchronization/find-all',
    DELETE: '/synchronization/delete/',
    DELETE_ALL: '/synchronization/delete-all/',
  };

  public static readonly ALERT_FLAG_TYPE = {
    FLAG: {
      NONE: 0,
      FMS: 1,
      PRTG: 2,
      FMC: 4,
      NAC: 8,
      ALL: 128,
    },
    NAME: {
      FMS: 'FMS',
      PRTG: 'PRTG',
      FMC: 'FMC',
      NAC: 'NAC',
      ALL: 'ALL',
    },
  };

  public static PARTY_CENTRAL_OFFICE = {
    FIND_ALL: '/party-central-office/find-all',
    FIND_BY_ID: '/party-central-office/find-by-id/',
    GET_CATEGORY_ALERTS_BY_UNIT_ID:
      '/party-central-office/get-category-alerts-by-unit-id/',
    SEARCH: '/party-central-office/search',
    ADD: '/party-central-office/add',
    UPDATE: '/party-central-office/update/',
    DELETE_BY_ID: '/party-central-office/delete/',
  };

  public static readonly EVENT_FMS: EventFMSModel = {
    BLACK_DOMAIN: 'BLACK_DOMAIN',
    MALWARE: 'MALWARE',
    INTERNET: 'POLICY',
  };

  public static readonly TRAFFIC_ZERO = {
    VOLUME: '0 MB',
    SPEED: '0 kbit/s',
  };

  public static readonly CHART = {
    HEIGHT: 350,
    LABEL: {
      ALERT: 'Cảnh báo',
      DEVICE: 'Thiết bị',
      UNIT: 'Đơn vị',
    },
    ID: {
      ALERT_SUMMARY: 'alertSummary',
    },
    CATEGORIES: {
      INTERNET: 'Vi phạm kết nối Internet',
      BLACK_DOMAIN: 'Truy vấn tên miền độc hại',
      MALWARE: 'Nhiễm mã độc',
      LABEL_XAXIS: {
        INTERNET: ['Vi phạm', 'kết nối Internet'],
        BLACK_DOMAIN: ['Truy vấn', 'tên miền độc hại'],
        MALWARE: 'Nhiễm mã độc',
      },
    },
    COLORS: {
      ALERT: '#FEB019',
      UNIT: '#008FFB',
      DATA_LABEL: '#304758',
    },
  };

  public static readonly DEFAULT_VIEW = {
    // CENTER: [12275927.601574156, 1885425.099110601],
    CENTER: [12019519.76249994, 1867300.2944341737],
    // ZOOM: 6,
    ZOOM: 7.3240309454795245,
    MIN_ZOOM: 6,
    MAX_ZOOM: 20,
  };

  public static readonly CUSTOM_EVENT_MAP = {
    SHOW_STATISTICAL_PANEL: 'showStatisticalPanel',
    GO_HOME: 'goHome',
    GO_TOPOLOGY: 'goTopology',
    EXPORT_WORD: 'exportWord',
  };

  public static readonly DIAGRAM_TOPOLOGY = {
    PATH_COLOR: '#009ef7',
    BACKGROUND_COLOR: '#eaeef2',
    PATH_DATA: {
      STATISTICAL:
        'M12,6a1,1,0,0,0-1,1V17a1,1,0,0,0,2,0V7A1,' +
        '1,0,0,0,12,6ZM7,12a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V13A1,' +
        '1,0,0,0,7,12Zm10-2a1,1,0,0,0-1,1v6a1,1,0,0,0,2,0V11A1,' +
        '1,0,0,0,17,10Zm2-8H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,' +
        '3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,' +
        '1,0,0,1,5,4H19a1,1,0,0,1,1,1Z',
      DETAIL:
        'M830 850H170q-8 0-14-6t-6-14V170q0-8 6-14t14-6h660q8 ' +
        '0 14 6t6 14v660q0 8-6 14t-14 6zM70 90v820q0 8 6 14t14 ' +
        '6h820q8 0 14-6t6-14V90q0-8-6-14t-14-6H90q-8 0-14 6t-6 ' +
        '14zm200 160h61q8 0 13.5 6t5.5 14v61q0 8-5.5 13.5T331 ' +
        '350h-61q-8 0-14-5.5t-6-13.5v-61q0-8 6-14t14-6zm200 0h260q8 ' +
        '0 14 6t6 14v61q0 8-6 13.5t-14 5.5H470q-9 0-14.5-5.5T450 ' +
        '331v-61q0-8 5.5-14t14.5-6zM270 450h61q8 0 13.5 5.5T350 ' +
        '470v60q0 9-5.5 14.5T331 550h-61q-8 0-14-5.5t-6-14.5v-60q0-9 ' +
        '6-14.5t14-5.5zm200 0h260q8 0 14 5.5t6 14.5v60q0 9-6 14.5t-14 ' +
        '5.5H470q-9 0-14.5-5.5T450 530v-60q0-9 5.5-14.5T470 450zM270 ' +
        '650h61q8 0 13.5 5.5T350 669v61q0 8-5.5 14t-13.5 6h-61q-8 ' +
        '0-14-6t-6-14v-61q0-8 6-13.5t14-5.5zm200 0h260q8 0 14 5.5t6 ' +
        '13.5v61q0 8-6 14t-14 6H470q-9 0-14.5-6t-5.5-14v-61q0-8 5.5-13.5T470 650z',
    },
    NAME: {
      STATISTICAL: 'statisticalHandle',
      DETAIL: 'detailHandle',
    },
  };

  public static readonly TOPOLOGY_MATERIAL = {
    DIAGRAM: {
      PATH_COLOR: '#009ef7',
      BACKGROUND_COLOR: '#eaeef2',
      PATH_DATA: {
        STATISTICAL:
          'M12,6a1,1,0,0,0-1,1V17a1,1,0,0,0,2,0V7A1,' +
          '1,0,0,0,12,6ZM7,12a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V13A1,' +
          '1,0,0,0,7,12Zm10-2a1,1,0,0,0-1,1v6a1,1,0,0,0,2,0V11A1,' +
          '1,0,0,0,17,10Zm2-8H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,' +
          '3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,' +
          '1,0,0,1,5,4H19a1,1,0,0,1,1,1Z',
        DETAIL:
          'M830 850H170q-8 0-14-6t-6-14V170q0-8 6-14t14-6h660q8 ' +
          '0 14 6t6 14v660q0 8-6 14t-14 6zM70 90v820q0 8 6 14t14 ' +
          '6h820q8 0 14-6t6-14V90q0-8-6-14t-14-6H90q-8 0-14 6t-6 ' +
          '14zm200 160h61q8 0 13.5 6t5.5 14v61q0 8-5.5 13.5T331 ' +
          '350h-61q-8 0-14-5.5t-6-13.5v-61q0-8 6-14t14-6zm200 0h260q8 ' +
          '0 14 6t6 14v61q0 8-6 13.5t-14 5.5H470q-9 0-14.5-5.5T450 ' +
          '331v-61q0-8 5.5-14t14.5-6zM270 450h61q8 0 13.5 5.5T350 ' +
          '470v60q0 9-5.5 14.5T331 550h-61q-8 0-14-5.5t-6-14.5v-60q0-9 ' +
          '6-14.5t14-5.5zm200 0h260q8 0 14 5.5t6 14.5v60q0 9-6 14.5t-14 ' +
          '5.5H470q-9 0-14.5-5.5T450 530v-60q0-9 5.5-14.5T470 450zM270 ' +
          '650h61q8 0 13.5 5.5T350 669v61q0 8-5.5 14t-13.5 6h-61q-8 ' +
          '0-14-6t-6-14v-61q0-8 6-13.5t14-5.5zm200 0h260q8 0 14 5.5t6 ' +
          '13.5v61q0 8-6 14t-14 6H470q-9 0-14.5-6t-5.5-14v-61q0-8 5.5-13.5T470 650z',
      },
      NAME: {
        STATISTICAL: 'statisticalHandle',
        DETAIL: 'detailHandle',
      },
    },
    ALERT_CLASS: {
      DEFAULT: 'alert-device-placeholder',
      GROUP: 'alert-group',
      // Single alert
      PRTG: 'alert-device-prtg',
      FMS: 'alert-device-fms',
      FMC: 'alert-device-fmc',
      NAC: 'alert-device-nac',
      // Double alert
      PRTG_FMS: 'alert-device-prtg-fms',
      PRTG_FMC: 'alert-device-prtg-fmc',
      PRTG_NAC: 'alert-device-prtg-nac',
      FMS_FMC: 'alert-device-fms-fmc',
      FMS_NAC: 'alert-device-fms-nac',
      FMC_NAC: 'alert-device-fmc-nac',
      // Triple alert
      PRTG_FMS_FMC: 'alert-device-prtg-fms-fmc',
      PRTG_FMS_NAC: 'alert-device-prtg-fms-nac',
      PRTG_FMC_NAC: 'alert-device-prtg-fmc-nac',
      FMS_FMC_NAC: 'alert-device-fms-fmc-nac',
      // Quadruple alert
      PRTG_FMS_FMC_NAC: 'alert-device-prtg-fms-fmc-nac',
      PRE_FIX_CIRCLE: 'blink_circle_',
      HOLDER: 'alert-device-placeholder',
    },

  };

  public static readonly MAP_MATERIAL = {
    COORDINATE_SYSTEM: {
      WGS84: 'EPSG:4326',
      WEB_MERCATOR: 'EPSG:3857',
    },
    WMS_FEATURE_ID_CODE: {
      VN_HCXA: 'HCXa',
      OSM_ROADS: 'osm_roads',
    },
  };

  public static readonly ASSETS = {
    UNIT: {
      REGIONS: [
        {
          text: 'Miền Bắc',
          value: 'B',
        },
        {
          text: 'Miền Trung',
          value: 'T',
        },
        {
          text: 'Miền Nam',
          value: 'N',
        },
      ],
    },
    STATISTICS: {
      STATUS_REFERENCE: [
        {
          text: 'Đã ánh xạ',
          value: true,
        },
        {
          text: 'Chưa ánh xạ',
          value: false,
        },
      ],
    },
    FMS: {
      TRANSLATE: {
        BLACK_DOMAIN: 'Truy cập tên miền độc hại',
        POLICY: 'Kết nối Internet',
        MALWARE: 'Nhiễm mã độc',
      },
    },
  };
  public static readonly SUB_TYPE_DEVICE = {
    TRONG_YEU_QUOC_GIA: '728.106',
    VP_CHU_TICH_NUOC: '728.106.108',
    VP_TW_DANG: '728.106.124',
    ALL: '728',
    ROOT: '728',
    QS_QP: '728.724',
    MAYTINH: 'MAYTINH',
    OTHER: 'OTHER',
  };
  public static readonly MAIN_TYPE = {
    QS: 'QS',
    INTERNET: 'INT',
    CD: 'CD',
  };
  public static readonly SERVICE_TYPE = {
    PORTAL: 'PORTAL',
    COMMON: 'COMMON',
  };
  public static readonly N_DAY = 5;
  public static readonly TYPE = {
    BQP: 'Bộ Quốc Phòng',
    TYQG: 'Hệ thống trọng yếu Quốc gia',
  };
  public static readonly SU_CO_MKN_TYPE = {
    R: 'Định tuyến',
    CY: 'Cơ yếu',
    SW: 'Chuyển mạch',
    FW: 'Tường lửa',
    MC: 'Máy chủ',
    TTDT: 'Cổng TTĐT',
    UDDC: 'ƯD dùng chung',
    HTGS: 'HTGS',
  };
  public static readonly SU_CO_ATTT_TYPE = {
    INTERNET: 'Kết nối Internet',
    MALWARE: 'Mã độc',
    HUNTING: 'Bất thường',
    BLACK_DOMAIN: 'Truy vấn độc hại',
  };
  public static readonly TIME_INTERVAL_LEFT_PANEL = 2 * 60000;
}
