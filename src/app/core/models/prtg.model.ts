import { IDeviceDto } from '../../modules/device/models/device.model';

export interface PrtgModel {
  uuid: string;
  orderDate: number;
  time: Date;
  deviceId: string;
  sensor: string;
  value: string;
}

export interface PrtgDtoModel extends PrtgModel {
  deviceName: string;
}

export interface PRTGCoreModel {
  id: string;
  name: string;
  type: string;
  position: number;
  icon: string;
  favorite: boolean;
  primaryChannelInfo: PrimaryChannelInfo;
  status: string;
  statusInfo: any;
  permissions: number;
  path: Path[];
  sensorSummary: any;
}

export interface PrimaryChannelInfo {
  channel: Channel;
  lastMeasurement: LastMeasurement;
  unit: Unit;
}

export interface Channel {
  id: string;
  type: string;
  name: string;
  href: string;
}

export interface LastMeasurement {
  timestamp: string;
  value: any;
  volume: any;
  minimum?: number | null;
  maximum?: number | null;
  average?: number | null;
  displayValue: any;
  displayVolume: any;
  displayMinimum: any;
  displayMaximum: any;
  displayAverage: any;
  lookupText: any[];
}

export interface Unit {
  type: string;
  custom: any;
  percent: any;
  displayUnit: string;
  displayVolumeUnit: any;
  decimalMode: string;
  decimalDigits: any;
}

export interface Path {
  id: string;
  type: string;
  name: string;
  href: string;
}

export interface SensorOverview {
  routerBCTT: IDeviceDto[];
  routerCY: IDeviceDto[];
}
