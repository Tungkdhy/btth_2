import {DeviceCountDto} from "./btth.dto";

export class DeviceCount {
  private _unitPath: string;
  private _type: string;
  private _count: number;

  constructor(deviceCountDb: DeviceCountDto) {
    this._unitPath = deviceCountDb.unit_path;
    this._type = deviceCountDb.type;
    this._count = deviceCountDb.count;
  }

  get unitPath(): string {
    return this._unitPath;
  }

  set unitPath(value: string) {
    this._unitPath = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }
}
