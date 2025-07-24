import { Constant } from '../config/constant';
import { TypeDevice } from '../../modules/device/models/device.model';
import { EventTypeFMS } from './fms.model';

export class SearchInfoSec {
  text: string;
  type: string;
  system: string;
  typeDevice: TypeDevice;
  category?: string;
  category1?: string;
  unitId: string;
  deviceId?: string;
  deviceSn?: string;
  originalId?: string;
  mac?: string;
  nodeId?: string;
  portId?: string;
  status: boolean | string;
  startDate: string;
  endDate: string;
  event: EventTypeFMS;

  page: number;
  size: number;
  sizeList: number[];
  length: number;
  direction?: string;
  sortBy?: string;

  previous: string;
  next: string;
  maxSize: number;
  rotate: boolean;

  constructor(obj?: any) {
    this.text = (obj && obj.text) || '';
    this.type = (obj && obj.type) || '';
    this.system = (obj && obj.system) || '';
    this.category = (obj && obj.category) || '';
    this.category1 = (obj && obj.category1) || '';
    this.status = (obj && obj.status) || '';
    this.unitId = (obj && obj.unitId) || '';
    this.deviceId = (obj && obj.deviceId) || '';
    this.deviceSn = (obj && obj.deviceSn) || '';
    this.mac = (obj && obj.mac) || '';
    this.nodeId = (obj && obj.nodeId) || '';
    this.portId = (obj && obj.portId) || '';
    this.startDate = (obj && obj.startDate) || '';
    this.endDate = (obj && obj.endDate) || '';
    this.event = (obj && obj.event) || '';

    this.page = (obj && obj.page) || Constant.PAGING.CURRENT_PAGE;
    this.size = (obj && obj.size) || Constant.PAGING.SIZE;
    this.sizeList = (obj && obj.sizeList) || Constant.PAGING.SIZE_LIST;
    this.length = (obj && obj.length) || 0;
    this.direction = (obj && obj.direction) || Constant.DIRECTION.DESC;
    this.sortBy = (obj && obj.sortBy) || null;

    this.previous = (obj && obj.previous) || Constant.PAGING.PREVIOUS;
    this.next = (obj && obj.next) || Constant.PAGING.NEXT;
    this.maxSize = (obj && obj.maxSize) || Constant.PAGING.MAX_SIZE;
    this.rotate = (obj && obj.rotate) || Constant.PAGING.ROTATE;
  }
}
