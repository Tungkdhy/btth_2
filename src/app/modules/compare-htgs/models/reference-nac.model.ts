export interface ReferenceDeviceNacModel {
  uuid: string;
  createBy: string;
  createDate: string;
  orderDate: string;
  updateBy: string;
  updateDate: string;
  accessible: boolean;
  hostName: string;
  lastAuthentication: any;
  model: string;
  protocol: string;
  serialNumber: string;
  status: boolean;
  type: string;
  unitId: string;
  vendor: string;
}
export interface ReferenceEndpointNacModel {
  uuid: string;
  orderDate: number;
  mac: string;
  ip: string;
  unitId: string;
  status: boolean;
  lastActivityTimestamp: number;
  destinationDeviceSn: string;
  destinationDevicePortName: string;
}
