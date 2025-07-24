import {SecurityEventType} from "./btth.type";

export interface SecurityEvent {
  unitPath: string;
  type: SecurityEventType;
  count: number;
}

