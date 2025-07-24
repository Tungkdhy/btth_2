import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandwidthAreaComponent } from '../../../modules/topology/components/diagram-topology/bandwidth-area/bandwidth-area.component';
import { PrtgAlertCardComponent } from '../prtg-alert-card/prtg-alert-card.component';
import { map, Observable, switchMap } from 'rxjs';
import {
  DeviceTotal,
  TypeDevice,
} from '../../../modules/device/models/device.model';
import {
  EndpointFMSCount,
  TypeEndpointModel,
} from '../../../modules/endpoint/models/endpoint.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitService } from '../../../modules/unit/services/unit.service';
import { FmsService } from '../../../modules/fms/services/fms.service';
import {
  ResponseAPI,
  ResultAPIModel,
} from '../../../core/models/api-response.model';
import { DevicesDataTableStatisticComponent } from '../../../modules/topology/components/dashboard-unit-card/devices-data-table-statistic/devices-data-table-statistic.component';
import { NeunLoadingComponent } from '../../neun-loading/neun-loading.component';
import { PrtgAlertCardPanelComponent } from '../prtg-alert-card-panel/prtg-alert-card-panel.component';
import { PrtgAlertCardSmallComponent } from '../prtg-alert-card-small/prtg-alert-card-small.component';
import { EventTypeFMS } from '../../../core/models/fms.model';
import { SearchInfoSec } from '../../../core/models/search';
import { Store } from '@ngrx/store';
import { selectDate } from '../../../store/date-time-range/date-time-range.selectors';
import { formatDateForElasticsearch } from '../../../_metronic/layout/core/common/common-utils';
import { StatisticsEndpointManagementComponent } from '../../../modules/statistics/components/statistics-endpoint-management/statistics-endpoint-management.component';
import { UtilsService } from '../../../core/services/utils.service';
import { StatisticsWarningGroupByDevice } from '../../../modules/statistics/models/statistics.model';
import { Constant } from '../../../core/config/constant';

@Component({
  selector: 'app-prtg-alert-widget',
  standalone: true,
  templateUrl: './prtg-alert-widget.component.html',
  styleUrls: ['./prtg-alert-widget.component.scss'],
  imports: [
    CommonModule,
    BandwidthAreaComponent,
    PrtgAlertCardComponent,
    NeunLoadingComponent,
    PrtgAlertCardPanelComponent,
    PrtgAlertCardSmallComponent,
  ],
})
export class PrtgAlertWidgetComponent implements OnInit {
  @Input() unitId: string;

  @Input() isMap = false;
  @Input() isTopology = false;

  classCardGeneral = 'col-sm-6 col-md-4 col-xxl-2 mb-5 mb-xl-10';
  classCardMap = 'col-xl-6 mb-2';

  now = new Date();
  cardLabels = Constant.LABLES.CARD;

  totalDevices$: Observable<DeviceTotal>;
  totalEndpoint$: Observable<EndpointFMSCount>;
  downDevices$: Observable<DeviceTotal>;

  internetAlerts$: Observable<number>;
  malwareAlerts$: Observable<number>;
  domainAlerts$: Observable<number>;

  private unitService: UnitService = inject(UnitService);
  private fmsService: FmsService = inject(FmsService);
  private modalService = inject(NgbModal);
  private utilsService = inject(UtilsService);

  constructor(private store: Store) {}

  ngOnInit() {
    this.fetchDeviceCountStats();
    this.fetchInfraWarningStats();
    this.fetchInfoSecWarningStats();
  }

  fetchDeviceCountStats() {
    this.totalDevices$ = this.utilsService
      .getUnitIdFromQueryParam()
      .pipe(switchMap((id) => this.fetchTotalDevices(id)));
    this.totalEndpoint$ = this.utilsService
      .getUnitIdFromQueryParam()
      .pipe(switchMap((id) => this.getEndpointFMSCount(id)));
  }

  fetchInfraWarningStats() {
    this.downDevices$ = this.utilsService
      .getIdWithInterval()
      .pipe(switchMap((id) => this.fetchTotalDevices(id, false)));
  }

  fetchInfoSecWarningStats() {
    this.internetAlerts$ = this.utilsService
      .getIdWithInterval()
      .pipe(switchMap((id) => this.countAlertsByEvent(id, 'POLICY')));
    this.malwareAlerts$ = this.utilsService
      .getIdWithInterval()
      .pipe(switchMap((id) => this.countAlertsByEvent(id, 'MALWARE')));
    this.domainAlerts$ = this.utilsService
      .getIdWithInterval()
      .pipe(switchMap((id) => this.countAlertsByEvent(id, 'BLACK_DOMAIN')));
  }

  fetchTotalDevices(unitId: string, status?: boolean): Observable<DeviceTotal> {
    return this.unitService.fetchTotalDeviceByUnit(unitId, status).pipe(
      map((response: ResultAPIModel): DeviceTotal => {
        const total: DeviceTotal = response.data;
        total.firewalls = !total.firewalls ? 0 : total.firewalls;
        total.switches = !total.switches ? 0 : total.switches;
        total.routers = !total.routers ? 0 : total.routers;
        return total;
      }),
    );
  }

  getEndpointFMSCount(unitId: string): Observable<EndpointFMSCount> {
    return this.fmsService.countEndpointByParentId(unitId);
  }

  countAlertsByEvent(unitId: string, event: EventTypeFMS): Observable<number> {
    const search = new SearchInfoSec();
    search.event = event;
    search.unitId = unitId;
    search.size = 1;
    return this.store.select(selectDate).pipe(
      switchMap((date: { startDate: Date; endDate: Date }) => {
        search.startDate = formatDateForElasticsearch(date.startDate);
        search.endDate = formatDateForElasticsearch(date.endDate);
        return this.fmsService.countWarningGroupByDevice(
          search.unitId,
          search.event,
          search.startDate,
          search.endDate,
        );
      }),
      map(
        (response: ResponseAPI<StatisticsWarningGroupByDevice[]>) =>
          response.data,
      ),
      map((data: StatisticsWarningGroupByDevice[]) => {
        return data.slice(1);
      }),
      map((data: StatisticsWarningGroupByDevice[]) => {
        return data.reduce(
          (accumulator, currentValue) => accumulator + currentValue.macs.length,
          0,
        );
      }),
    );
  }

  openDevicesModal(
    unitId: string,
    type: TypeDevice | TypeEndpointModel,
    status?: boolean,
  ): void {
    const deviceModal = this.modalService.open(
      DevicesDataTableStatisticComponent,
      {
        size: 'xl',
      },
    );
    deviceModal.componentInstance.unitId = unitId;
    deviceModal.componentInstance.type = type;
    deviceModal.componentInstance.status = status !== undefined ? status : '';
  }

  openEndpointManagementModal(unitId: string) {
    const endpointManagementModal = this.modalService.open(
      StatisticsEndpointManagementComponent,
      {
        size: 'xl',
      },
    );
    endpointManagementModal.componentInstance.unitId = unitId;
  }
}
