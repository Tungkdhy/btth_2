import { Coordinate } from 'ol/coordinate';
import { ConnectorModel, NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { DeviceType, EndpointType, HotSpotType } from './btth.type';
import { GeoJson } from './geographical-coordinates';

export interface RegionMap {
  all: RegionView;
  north: RegionView;
  central: RegionView;
  south: RegionView;
}

export interface RegionView {
  center: Coordinate;
  zoom: number;
}

export interface UnitBtth {
  id: string;
  name: string;
  parentId: string | null;
  parentName: string | null;
  city: string | null;
  district: string | null;
  region: string;
  path: string;
  intId: number;
  intIdParent: number | null;
  long: number | null;
  lat: number | null;
  corePlace: string | null;
  boundaryPlace: string | null;
  core: string | null;
  boundary: string | null;
  hasChildren: boolean;
  sort: number | null;
}

export interface NetworkSystem {
  core: CoreLayer;
  boundary: BoundaryLayer;
  access: AccessLayer;
}

export interface CoreLayer {
  id: string;
  name: string;
  abbr: string;
  longitude: number;
  latitude: number;
}

export interface BoundaryLayer {
  id: string;
  name: string;
  path: string;
  coreId: string;
  coreName: string;
  abbr: string;
  longitude: number;
  latitude: number;
  device: string;
  wan: string;
  wanTn: string;
}

export interface AccessLayer {
  path: string;
  pathParent: string;
  coreId: string;
  boundaryId: string;
  coreName: string; // core code
  boundaryName: string; // boundary code
  longitude: number | null;
  latitude: number | null;
  name: string;
  icon: string | null;
  sort: number | null;
}

export interface TopologyData {
  nodes: NodeTopologyV2[];
  connectors: ConnectorTopology[];
}

export interface NodeTopology extends NodeModel {
  id: string;
  unitId: string;
  mainType: string;
  type: string;
  category: string | null;
  status: boolean;
  nms: NMS;
  nac: any; // Assuming 'nac' is of type 'any', adjust as needed
  unit: Unit;
  coor: Coor;
}

export interface DeviceCoordinate {
  serialNumber: string;
  x: number;
  y: number;
}

export interface NodeTopologyV2 extends NodeModel {
  id: string;
  name: string;
  unitPath: string;
  mainType: string;
  type: string;
  category: string | null;
  status: boolean;
  coor: Coor;
}

interface NMS {
  uuid: string;
  serialNumber: string;
  name: string;
  status: boolean;
  type: string;
  category: string | null;
  hostName: string | null;
  unitId: string;
  osVersion: string | null;
  vendor: string | null;
  model: string | null;
  isAccessible: boolean;
  managerName: string | null;
  managementIp: string;
  isGeneratedSn: boolean;
  lastSnmp: string;
  systemHealthCpu: any; // Adjust type as needed
  systemHealthMemory: any; // Adjust type as needed
  systemHealthTemperatures: any; // Adjust type as needed
  mainType: string;
  lastActive: string;
  lastUpdate: string;
}

interface Unit {
  id: string;
  name: string;
  parentId: string;
  description: string | null;
  address: string | null;
  addressNumber: number;
  city: string;
  district: string;
  street: string;
  ward: string;
  iconId: string;
  sort: any; // Adjust type as needed
  region: string;
  intId: number;
  path: string;
  intIdParent: number;
  nameSearch: string;
  ts: string;
  icondId: number;
  long: number;
  lat: number;
  ttbien: any; // Adjust type as needed
}

interface Coor {
  id: number;
  serialNumber: string;
  x: number;
  y: number;
}

export interface ConnectorTopology extends ConnectorModel {
  id: string;
  sourceID: string;
  targetID: string;
}

export enum LayerIds {
  MILITARY_1,
  MILITARY_2,
  MILITARY_3,
  VIETNAM_ALL,
  VIETNAM_MOSAIC,

  CORE,
  BOUNDARY,
  ACCESS,
  // Specific access levels
  ACCESS_LEVEL_3,
  ACCESS_LEVEL_4,
  ACCESS_LEVEL_5,

  IS_ALERT_CORE, // IS: Information Security
  IS_ALERT_BOUNDARY,
  // IS_ALERT_ACCESS,
  IS_ALERT_ACCESS_LEVEL_3, // New alert layers for each access level
  IS_ALERT_ACCESS_LEVEL_4,
  IS_ALERT_ACCESS_LEVEL_5,

  NI_ALERT_CORE, // NI: Network Infrastructure
  NI_ALERT_BOUNDARY,
  // NI_ALERT_ACCESS,
  NI_ALERT_ACCESS_LEVEL_3, // New alert layers for each access level
  NI_ALERT_ACCESS_LEVEL_4,
  NI_ALERT_ACCESS_LEVEL_5,

  // Military
  MILITARY_REGION,
  BACKBONE_NODES,
  QA_ROUTE,
  QB_ROUTE,
  QC_ROUTE,
  MILITARY_BRANCH_LINE,

  // Administration
  COMMUNE,
  DISTRICT,
  PROVINCE,
  NATION,

  // Internet
  SEA_CABLE,
  AAE_CABLE,
  AAG_CABLE,
  ADC_CABLE,
  APG_CABLE,
  SJC2_CABLE,
  SMW3_CABLE,
  TGN_CABLE,
  AGGREGATION_ROUTES,
  CABLE_LANDING_STATIONS,
  FIBER_CABLE_TO_CHINA,
  FIBER_CABLE_TO_CAMPUCHIA,
  FIBER_CABLE_TO_LAOS,
}

export enum IwLayerIds {
  NUANCE,
  HOTSPOT_INFO,
  HOTSPOT_STATS,
}

export enum CoreCode {
  A40 = 'A40',
  A91 = 'A91',
  A99 = 'A99',
}

export enum UnitPath {
  ROOT = '728',
  QS_QP = '728.724',
  VP_TW = '728.106',
}

export enum REGION {
  NORTH = 'A40',
  CENTRAL = 'A91',
  SOUTH = 'A99',
}

export interface MapStatistics {
  rawData: any[];
  formattedData: MapDeviceCount[];
}

export interface MapDeviceCount {
  id: string;
  total: number;
  disconnected?: number;
}

export interface NetworkInfrastructureTreeCount {
  type: EndpointType | DeviceType;
  unitPath: string;
  unitName?: string;
  unitNameFull: string | null;
  coreLayerName: string | null;
  boundaryLayerName: string | null;
  total: number;
  status?: boolean;
}

export interface SecurityEventTreeCount {
  type: string;
  unitPath: string;
  unitName?: string; // Optional, will be filled later
  unitNameFull: string | null;
  coreLayerName: string;
  boundaryLayerName: string;
  total: number;
  warningLevel: number;
}

export interface NewsStats {
  district: string;
  total: number;
  positive: number;
  negative: number;
  neutral: number;
}

export interface AdministrativeAreaSuggestionResult {
  id: string;
  cityName: string;
  districtName: any;
  geographicCode: string;
  coordinates: GeoJson;
  center: GeoJson;
}

export interface UnitSuggestionResult {
  id: string;
  unitSearch: string | null;
  areaSearch: any | null;
  score: string;
  unit: Unit;
  coordinates: GeoJson;
}

export enum AlertType {
  ALL = 'ALL',
  INFO_SEC = 'INFO_SEC',
  NETWORK = 'NETWORK',
}

export type InfrastructureCountMap = Map<string, InfrastructureCount>;

export interface InfrastructureCount {
  id: string;
  name: string;
  unitName?: string | null;
  deviceCount: number;
  endpointCount: number;
  disconnectedCount: number;
  alertCount: number; // Add alertCount to the map
}

export enum EventId {
  POPUP = 'popup',
  CHANGE_THEME = 'change-theme',
  MAP = 'map',
  CYBER_WARFARE_MAP = 'cyber-warfare-map',
  INFO_WARFARE_MAP = 'info-warfare-map',
  CYBER_DEFENSE_MAP = 'cyber-defense-map',
  DATE = 'date',
  AREA = 'area',
  UNIT = 'unit',
  CLOSE_POPUP = 'close-popup',
  PANELALL = 'All',
  PANEL1 = 'Panel1',
  PANEL2 = 'Panel2',
  PANEL3 = 'Panel3',
  PANEL4 = 'Panel4',
  RESET_STATE = 'reset-state',
  SHOW_MID_RIGHT = 'show-mid-right',
  SHOW_MID_LEFT = 'show-mid-left',
}

export enum MapSubType {
  INFRASTRUCTURE_ALERT = 'infrastructure-alert',
  CYBER_SECURITY_ALERT = 'cyber-security-alert',
  // Thêm các loại cảnh báo khác nếu cần
}

export interface HotSpotInfo {
  name: string;
  address: string;
  unit: string[];
  longitude: number;
  latitude: number;
  type?: HotSpotType;
}

export interface HotSpotStatistics {
  unit: string;
  longitude: number;
  latitude: number;
  totalBots: number;
  totalIndustrialParks: number;
  totalParishes: number;
}

export interface NuanceStats {
  id: string;
  name: string;
  totalCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  coordinates: GeoJson;
  center: GeoJson;
}

export enum MainType {
  MILITARY = 'QS',
  INTERNET = 'INT',
  CD = 'CD',
}

export enum MonitoringSystemType {
  NAC = 'nac',
  NMS = 'nms',
}

export interface ApiFilter {
  sourceMac: string | null;
  mainType: MainType | null;
  subType: string | null;
  subTypeList: string[];
  // columnType: 'device' | 'server' | 'server_monitor';
  alertSource: string;
  columnType: string;
  core: CoreCode | string | null;
  coreList: CoreCode[];
  boundary: string | null;
  boundaryList: string[];
  searchText: string;
  page: number;
  limit: number;
  from: string | null;
  to: string | null;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface InfraAlertData {
  id: string;
  sys: string;
  name: string; // ' <loại cảnh báo> - <tên đơn vị>'
  type: string;
  core: string;
  status: string; // 'down' or 'up'
  boundary: string;
  remedy: any | null;
  mainType: string;
  unitPath: string;
  description: string;
  lastActive: string;
}

export interface InfoSecAlertData {
  core: string;
  remedy: any | null;
  boundary: string;
  message: string;
  portId: string | null;
  unitId: string;
  deviceSn: string | null;
  mainType: string | null;
  sourceIp: string | null;
  unitPath: string;
  alertName: string;
  alertType: string;
  sourceMac: string;
  lastActive: string;
  alertSource: string | null;
  employeeName: string;
  warningLevel: number;
  destinationIp: string | null;
  destinationMac: string | null;
  employeePosition: string;
  destinationDomain: string | null;
}

export interface AlertListPagination<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export interface ContactInformation {
  id: string;
  name: string | null;
  rank: string | null;
  position: string | null;
  phone: string | null; // Add +84 or 0
  hotline: string | null;
}

export interface DutySchedule {
  present: number;
  dutySchedules: UnitDutySchedule[];
  reportDate: string;
  personnelCount: number;
  dutyCommander: string;
  absent: number;
}

export interface UnitDutySchedule {
  unitId: string;
  unitName: string;
  deputyDutyOfficer: string;
  dutyOfficer: string;
  commandingOfficer: string;
}

export interface UnitDutyDetail {
  unitId: string;
  fullUnitName: string;
  unitName: string;
  deputyDutyOfficer: string;
  dutyOfficer: string;
  commandingOfficer: string;
  abbreviation: string;
}

// Define sys types as an enum
export enum SysTypes {
  FIREWALL = 'device_FIREWALL_',
  ROUTER_BCTT = 'device_ROUTER_ROUTER_BCTT',
  ROUTER_CY = 'device_ROUTER_ROUTER_CY',
  SWITCH = 'device_SWITCH_',
  SERVER = 'device_SERVER_',
  MONITOR = 'server_monitor',
  COMMON = 'service_COMMON',
  PORTAL = 'service_PORTAL',
}

export interface FeatureDisplayData {
  id: string | number;
  name: string;
  code?: string;
  foreignCode?: string;
  unitPath: string | null;
  icon: string | null;
  layerId: LayerIds;
  alertType?: AlertType | null;
}

export interface OverviewStatistics {
  unitName: string;
  parentName?: string | null;
  unitPath: string;
  totalNetworkDevices: number;
  totalEndpoints: number;
  totalDisconnectedNetworkDevices: number;
  totalSecurityViolations: number;
  sort?: number | null;
}

export interface GroupedAlerts {
  unitPath: string;
  name: string;
  core: string;
  boundary: string;
  count: number;
  remedyStatus: string;
}

export interface Settings {
  id: number;
  name: string;
  from: string;
  to: string;
  createdAt: string;
}

export interface Statistics {
  router: number;
  switch: number;
  firewall: number;
  server: number;
  client: number;
  disconnected: number;
  infoSec: number;
}

export enum Period {
  TODAY = 'today',
  IN_DAY = 'in day',
  THIS_WEEK = 'this week',
  IN_WEEK = 'in week',
  LAST_WEEK = 'last week',
  THIS_MONTH = 'this month',
  LAST_MONTH = 'last month',
  THIS_YEAR = 'this year',
  LAST_YEAR = 'last year',
}

export enum diemNongType {
  GIAO_XU = 'Giáo xứ',
  KHU_CONG_NGHIEP = 'Khu công nghiệp',
  BOT = 'BOT',
}
