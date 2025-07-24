import { SocketEventType } from './utils-type';
import { TCTTTargetType } from './btth.type';
import { EventId, MapSubType } from './btth.interface';

// export interface PayloadChannel {
//   socketEventType: SocketEventType;
//   data: PayloadData;
// }

export interface PayloadChannel {
  socketEventType: SocketEventType;
  data: PayloadData;
}

export interface PayloadData {
  tctt?: {
    type: TCTTTargetType;
  };
}

export interface PayloadChannelData {
  type: EventId;
  data: EventDataPayload | any;
}

export interface EventDataPayload {
  subType: MapSubType; // Loại cảnh báo, ví dụ: 'infrastructure-alert', 'cyber-security-alert', v.v.
  dataType: DataTypePayload; // Kiểu dữ liệu: 'object' hoặc 'array'
  actualData: any; // Dữ liệu thực tế, có thể là một đối tượng hoặc một mảng đối tượng
}

export type DataTypePayload = 'object' | 'array' | null;
