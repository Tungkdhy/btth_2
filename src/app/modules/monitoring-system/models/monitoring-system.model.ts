import {SearchCommonModel} from "../../../core/models/search-common.model";

export interface MonitoringSystemModel {
  uuid: string;
  name: string;
  type: string;
  username: string;
  password: string;
  linkAPI: string;
  active: string;
  orderDate: number;
}

export type TypeMonitoringModel = 'PRTG' | 'FMS' | any;

export interface SearchMonitoringSystemModel extends SearchCommonModel {
  username: string;
}
