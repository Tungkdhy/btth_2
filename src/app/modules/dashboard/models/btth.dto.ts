import { SecurityEventType } from './btth.type';

export interface DeviceCountDto {
  unit_path: string;
  type: string;
  count: number;
}

export interface SecurityEventCountDto {
  unit_path: string;
  type: SecurityEventType;
  count: number;
}

export interface TCTTTargetsDto {
  name: string;
  latitude: number | null;
  longitude: number | null;
  province: string | null;
}

export interface Troops {
  CoMat: number;
  NgayBaoCao: string;
  QuanSo: number;
  TrucChiHuy: string;
  Vang: number;
  LichTruc: DutyRoster[];
}

export interface DutyRoster         {
  TenDonVi: string,
  TrucBanPho: string,
  TrucBanTruong: string,
  TrucCH: string,
}

export interface BCTTRouterDto {
  idloi: number,
  tenloi: string,
  viettatloi: string,
  longloi: number,
  latloi: number,
  idbien: number,
  tenbien: string,
  viettatbien: string,
  thietbi: string,
  wan: string,
  wantn: string,
  longbien: number,
  latbien: number,
  upath: string | null,
  ulong: number,
  ulat: number,
  uname: string,
}

export interface BCTTRouter extends BCTTRouterDto {
  uparentpath: string | null;
}
