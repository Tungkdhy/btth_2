import { inject, Injectable } from '@angular/core';
import { ApiHelper } from './api-helper.service';
import { Observable } from 'rxjs';
import {
  ResponseAPI,
  ResultListNoPaginationModel,
} from '../models/api-response.model';
import { Constant } from '../config/constant';
import {
  AllSystemType,
  ReferenceStatistics,
  ReferenceSystemType,
  UnitOtherPublic,
} from '../models/public.model';
import { map } from 'rxjs/operators';
import { FieldsModel } from '@syncfusion/ej2-angular-dropdowns';
import {
  MonitoringServer,
  StatisticsServer,
} from '../../modules/statistics/models/statistics.model';
import {
  deepCopyUseJSON,
  isDateGreaterThanDays,
} from '../../_metronic/layout/core/common/common-utils';
import { UnitModelForDropDown } from '../../modules/unit/models/unit.model';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  private apiHelper: ApiHelper = inject(ApiHelper);

  mapFromUnitOtherToUnitModel(unit: UnitOtherPublic): UnitModelForDropDown {
    return {
      id: unit.idOrigin,
      parentId: unit.parentIdOrigin,
      name: unit.name,
      hasRef: unit.hasRef,
    };
  }

  // mapFromUnitMgisToUnitModel(unit: UnitMgisPublic): UnitModelForDropDown {
  //   return {
  //     id: unit.id,
  //     parentId: unit.parentId,
  //     name: unit.name,
  //   };
  // }

  updateHasChildrenForUnits(
    data: UnitModelForDropDown[],
  ): UnitModelForDropDown[] {
    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];
      const hasNoChildren = data.every((child) => child.parentId !== item.id);
      item.hasChildren = !hasNoChildren;
    }
    return data;
  }

  convertFromUnitModelDropDownToFields(
    units: UnitModelForDropDown[],
  ): FieldsModel {
    const dataSource = this.updateHasChildrenForUnits(units);
    return {
      dataSource: dataSource as any[],
      value: 'id',
      text: 'name',
      parentValue: 'parentId',
      hasChildren: 'hasChildren',
    };
  }

  getUnits(system: AllSystemType): Observable<ResponseAPI<UnitOtherPublic[]>> {
    switch (system) {
      case 'fms':
        return this.apiHelper.get(Constant.URLS.PUBLIC.UNIT.FMS.GET_ALL);
      case 'ta21':
        return this.apiHelper.get(Constant.URLS.PUBLIC.UNIT.TA21.GET_ALL).pipe(
          map((response: ResponseAPI<UnitOtherPublic[]>) => {
            const updatedResponse = deepCopyUseJSON(response);
            updatedResponse.data = this.updateParentIdOriginIfNotExist(
              updatedResponse.data,
            );
            return updatedResponse;
          }),
        );
      case 'nms':
        return this.apiHelper.get(Constant.URLS.PUBLIC.UNIT.NMS.GET_ALL);
      default:
        return this.apiHelper.get(Constant.URLS.PUBLIC.UNIT.MGIS);
    }
  }

  getUnitFieldsForDropdown(system: AllSystemType): Observable<FieldsModel> {
    return this.getUnits(system).pipe(
      map((response: ResponseAPI<UnitOtherPublic[]>) => {
        const data = response.data as UnitOtherPublic[];
        const units = data.map((item) =>
          this.mapFromUnitOtherToUnitModel(item),
        );
        return this.convertFromUnitModelDropDownToFields(units);
      }),
    );
  }

  getRefTotal(system: AllSystemType): Observable<ReferenceStatistics> {
    return this.getUnits(system).pipe(
      map((response: ResponseAPI<UnitOtherPublic[]>) => {
        const data = response.data as unknown as UnitOtherPublic[];
        return {
          total: data.length,
          referenced: data.filter((item) => item.hasRef).length,
        };
      }),
    );
  }

  getByRefSystemAndId(
    system: ReferenceSystemType,
    refId: string,
  ): Observable<ResponseAPI<UnitOtherPublic[]>> {
    switch (system) {
      case 'fms':
        return this.apiHelper.get(
          Constant.URLS.PUBLIC.UNIT.FMS.GET_BY_ID(refId),
        );
      case 'ta21':
        return this.apiHelper.get(
          Constant.URLS.PUBLIC.UNIT.TA21.GET_BY_ID(refId),
        );
      default:
        return this.apiHelper.get(
          Constant.URLS.PUBLIC.UNIT.NMS.GET_BY_ID(refId),
        );
    }
  }

  getServers(
    type: ReferenceSystemType,
  ): Observable<ResponseAPI<MonitoringServer[]>> {
    const url = Constant.URLS.PUBLIC.SERVER.GET;
    return this.apiHelper.get(`${url}?type=${type.toUpperCase()}`);
  }

  getMonitoringServerStatusStatistics(
    system: ReferenceSystemType,
  ): Observable<StatisticsServer> {
    return this.getServers(system).pipe(
      map((response: ResponseAPI<MonitoringServer[]>) => {
        const data = response.data;
        return {
          total: data.length,
          disconnectNumber: data.filter((server: MonitoringServer) =>
            isDateGreaterThanDays(server.pingTime, Constant.MAX_OFFLINE_DAYS),
          ).length,
        };
      }),
    );
  }

  updateParentIdOriginIfNotExist(items: UnitOtherPublic[]): UnitOtherPublic[] {
    const idSet = new Set(items.map((item) => item.idOrigin));

    return items.map((item) => {
      if (item.parentIdOrigin && !idSet.has(item.parentIdOrigin)) {
        return { ...item, parentIdOrigin: null };
      }
      return item;
    });
  }
}
