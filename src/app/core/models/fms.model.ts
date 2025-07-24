export interface FmsModel {
  uuid: string;
  active: boolean;
  orderDate: number;
  mac: string;
  ip: string;
  unitId: string;
  type: string;
  description: string;
  event: EventTypeFMS;
  destinationIp: string;
  level: number;
  unitName: string;
  manager: string;
  domain: string;
  system: string;

  status: boolean;
  vlan: string;
  deviceName: string;
}

export type EventTypeFMS = 'BLACK_DOMAIN' | 'POLICY' | 'MALWARE' | 'FMC';

export interface EventFMSModel {
  BLACK_DOMAIN: EventTypeFMS;
  INTERNET: EventTypeFMS;
  MALWARE: EventTypeFMS;
}

export interface AvVersionStatistic {
  version: string;
  count: number;
}
