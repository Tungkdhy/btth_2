import { Injectable } from '@angular/core';
import { ApiHelper } from '../../../core/services/api-helper.service';
import {
  ResultListNoPaginationModel,
  ResultListPaginationModel,
} from '../../../core/models/api-response.model';
import { Observable } from 'rxjs';
import { Constant } from '../../../core/config/constant';
import {
  MonitoringSystemModel,
  SearchMonitoringSystemModel,
} from '../models/monitoring-system.model';

@Injectable({
  providedIn: 'root',
})
export class MonitoringSystemService {
  constructor(private apiHelper: ApiHelper) {}

  public add(
    form: MonitoringSystemModel,
  ): Observable<ResultListNoPaginationModel> {
    return this.apiHelper.post(Constant.MONITORING_SYSTEM.ADD, form);
  }

  public getDetail(uuid: string): Observable<ResultListNoPaginationModel> {
    return this.apiHelper.get(Constant.MONITORING_SYSTEM.GET_DETAIL + uuid);
  }

  public getList(): Observable<ResultListNoPaginationModel> {
    return this.apiHelper.get(Constant.MONITORING_SYSTEM.GET_LIST);
  }

  public update(
    form: MonitoringSystemModel,
  ): Observable<ResultListNoPaginationModel> {
    return this.apiHelper.put(
      Constant.MONITORING_SYSTEM.UPDATE + form.uuid,
      form,
    );
  }

  public delete(uuid: string): Observable<ResultListNoPaginationModel> {
    return this.apiHelper.delete(Constant.MONITORING_SYSTEM.DELETE + uuid);
  }

  public getPagingList(
    search: SearchMonitoringSystemModel,
  ): Observable<ResultListPaginationModel<any>> {
    return this.apiHelper.get(
      Constant.MONITORING_SYSTEM.GET_PAGING_LIST +
        '?searchKey=' +
        search.query +
        '&page=' +
        search.page +
        '&size=' +
        search.size +
        '&active=' +
        search.active,
    );
  }
}
