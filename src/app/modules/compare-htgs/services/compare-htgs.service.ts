import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Constant } from '../../../core/config/constant';
import { ApiHelper } from '../../../core/services/api-helper.service';
import { IDevice, TypeDevice } from '../../device/models/device.model';
import {
  ResponseAPI,
  ResultListPaginationModel,
} from '../../../core/models/api-response.model';
import {
  ReferenceDeviceNacModel,
  ReferenceEndpointNacModel,
} from '../models/reference-nac.model';
import { TypeEndpointModel } from '../../endpoint/models/endpoint.model';
import { ReferenceFmsModel } from '../models/reference-fms.model';
import { ReferenceTa21Model } from '../models/reference-ta21.model';

@Injectable({
  providedIn: 'root',
})
export class CompareHtgsService {
  constructor(private apiHelper: ApiHelper) {}
  private baseUrl = Constant.URLS.REF;

  getDeviceRefNac(
    parentId: string,
    type: TypeDevice,
    size: number = 1,
    page: number = 1,
  ): Observable<ResultListPaginationModel<ReferenceDeviceNacModel>> {
    const params = [
      `parentId=${parentId}`,
      `type=${type}`,
      `size=${size}`,
      `page=${page}`,
    ].join('&');
    const url = `${this.baseUrl.DEVICE.NAC}?${params}`;
    return this.apiHelper.get(url);
  }

  getDeviceRefPrtg(
    parentId: string,
    type: TypeDevice,
    size: number = 1,
    page: number = 1,
  ): Observable<ResultListPaginationModel<IDevice>> {
    const params = [
      `parentId=${parentId}`,
      `type=${type}`,
      `size=${size}`,
      `page=${page}`,
    ].join('&');
    const url = `${this.baseUrl.DEVICE.PRTG}?${params}`;
    return this.apiHelper.get(url);
  }

  saveDeviceRefPrtg(
    idNms: string,
    serialNumber: string,
  ): Observable<ResponseAPI<any>> {
    const url = `${this.baseUrl.DEVICE.PRTG}/${idNms}`;
    return this.apiHelper.post(url, serialNumber);
  }

  deleteDeviceRefPrtg(idNms: string): Observable<ResponseAPI<any>> {
    const url = `${this.baseUrl.DEVICE.PRTG}/${idNms}`;
    return this.apiHelper.delete(url);
  }

  getEndpointRefNac(
    parentId: string,
    type: TypeEndpointModel,
    size: number = 1,
    page: number = 1,
  ): Observable<ResultListPaginationModel<ReferenceEndpointNacModel>> {
    const params = [
      `parentId=${parentId}`,
      `type=${type}`,
      `size=${size}`,
      `page=${page}`,
    ].join('&');
    const url = `${this.baseUrl.ENDPOINT.NAC}?${params}`;
    return this.apiHelper.get(url);
  }

  getEndpointRefFms(
    parentId: string,
    type: TypeEndpointModel,
    size: number = 1,
    page: number = 1,
  ): Observable<ResultListPaginationModel<ReferenceFmsModel>> {
    const params = [
      `parentId=${parentId}`,
      `type=${type}`,
      `size=${size}`,
      `page=${page}`,
    ].join('&');
    const url = `${this.baseUrl.ENDPOINT.FMS}?${params}`;
    return this.apiHelper.get(url);
  }

  getEndpointRefTa21(
    parentId: string,
    type: TypeEndpointModel,
    size: number = 1,
    page: number = 1,
  ): Observable<ResultListPaginationModel<ReferenceTa21Model>> {
    const params = [
      `parentId=${parentId}`,
      `type=${type}`,
      `size=${size}`,
      `page=${page}`,
    ].join('&');
    const url = `${this.baseUrl.ENDPOINT.TA21}?${params}`;
    return this.apiHelper.get(url);
  }
}
