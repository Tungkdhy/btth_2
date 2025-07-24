export interface SearchCommonModel {
  query: string;
  name: string;
  type?: string;
  unitId?: string;
  status?: string | boolean;
  systemTable?: string;
  publishDateStart?: Date | number;
  publishDateEnd?: Date | number;

  page: number;
  size: number;
  length: number;
  active: string;
  direction?: string;
  sortBy?: string;

  previous: string;
  next: string;
  maxSize: number;
  rotate: boolean;
}

export interface SearchMonitoringSystemModel extends SearchCommonModel {
  username: string;
}

export class SearchModel {
  query: string;
  name: string;
  type?: string;
  unitId?: string;
  status?: string | boolean | null;
  systemTable?: string;
  system?: string;
  orderDateStart?: Date | number;
  orderDateEnd?: Date | number;

  page = 1;
  size = 20;
  length: number;
  direction?: string;
  sortBy?: string;

  previous = 'Trước';
  next = 'Sau';
  maxSize = 3;
  rotate = true;

  constructor() {
    this.query = '';
    this.name = '';
    this.type = '';
    this.system = '';
    this.unitId = '';
    this.status = null;
    this.systemTable = '';
  }
}
