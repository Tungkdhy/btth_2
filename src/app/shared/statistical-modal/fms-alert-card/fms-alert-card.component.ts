import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetDirective } from '@ngrx/component';
import {
  distinctUntilChanged,
  interval,
  map,
  Observable,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  selectDate,
  selectEndDate,
  selectStartDate,
} from '../../../store/date-time-range/date-time-range.selectors';
import { DateTimeRangePickerComponent } from '../../date-time-range-picker/date-time-range-picker.component';
import { setDate } from '../../../store/date-time-range/date-time-range.actions';
import { EventTypeFMS } from '../../../core/models/fms.model';
import { Constant } from '../../../core/config/constant';
import { formatDateForElasticsearch } from '../../../_metronic/layout/core/common/common-utils';
import { ResponseAPI } from '../../../core/models/api-response.model';
import { FmsService } from '../../../modules/fms/services/fms.service';
import { SummaryFmsAlertCardComponent } from './summary-fms-alert-card/summary-fms-alert-card.component';
import { DetailFmsAlertCardComponent } from './detail-fms-alert-card/detail-fms-alert-card.component';
import { ViolatedDeviceModel } from '../../../modules/topology/models/violated-device.model';
import { StatisticViolatedDeviceComponent } from '../../../modules/user-manager/components/statistic-violated-device/statistic-violated-device.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SummaryFmsAlertCardPanelComponent } from './summary-fms-alert-card-panel/summary-fms-alert-card-panel.component';
import { DataPoint } from '../../../core/models/apex-chart-options.model';
import {
  Statistic,
  StatisticsWarningGroupByDevice,
} from '../../../modules/statistics/models/statistics.model';

@Component({
  selector: 'app-fms-alert-card',
  standalone: true,
  imports: [
    CommonModule,
    DateTimeRangePickerComponent,
    LetDirective,
    NgApexchartsModule,
    SummaryFmsAlertCardComponent,
    DetailFmsAlertCardComponent,
    SummaryFmsAlertCardPanelComponent,
  ],
  templateUrl: './fms-alert-card.component.html',
  styleUrls: ['./fms-alert-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FmsAlertCardComponent {
  private _unitId: string;

  @Input()
  set unitId(value: string) {
    if (!value) return;
    this._unitId = value;

    this.store
      .select(selectDate)
      .pipe(take(1))
      .subscribe({
        next: (date) => {
          this.startDate = date.startDate;
          this.endDate = date.endDate;
          this.getAllAlerts(date.startDate, date.endDate);
        },
      });
  }

  get unitId(): string {
    return this._unitId;
  }

  @Input() isMap: boolean = false;

  summaryChartId = 'chart-summary';
  detailChartId = 'chart-detail';

  static readonly CHART_CLASS = {
    DETAIL_ACTIVATED: 'chart-detail-activated',
    ACTIVE: 'active',
  };

  blackDomain$: Observable<Statistic>;
  internet$: Observable<Statistic>;
  malware$: Observable<Statistic>;

  startDate$: Observable<Date>;
  endDate$: Observable<Date>;

  violatedDevices: ViolatedDeviceModel = <ViolatedDeviceModel>{};

  private fmsService: FmsService = inject(FmsService);
  private modal: NgbModal = inject(NgbModal);

  startDate: Date;
  private endDate: Date;

  constructor(private store: Store) {
    this.startDate$ = this.store.select(selectStartDate);
    this.endDate$ = this.store.select(selectEndDate);
  }

  handleSelectDate(date: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }): void {
    if (!date.startDate || !date.endDate) return;
    if (this.isDetailChartActivated()) this.deactivateChartDetail();
    this.store.dispatch(
      setDate({ startDate: date.startDate, endDate: date.endDate }),
    );
    this.getAllAlerts(date.startDate, date.endDate);
    this.startDate = date.startDate;
    this.endDate = date.endDate;
  }

  handleActiveDetailChart(dataPoint: DataPoint): void {
    if (dataPoint.hasDataPointSelect) {
      console.log(dataPoint);
      if (!this.isDetailChartActivated()) {
        this.activateChartDetail();
      }
      if (!dataPoint.selectedData || !dataPoint.eventType) return;
      this.updateDetailChart(dataPoint.selectedData, dataPoint.eventType);
    } else {
      this.deactivateChartDetail();
    }
  }

  getDetailChartElement(): Element | null {
    return document.querySelector(`#${this.detailChartId}`);
  }
  getSummaryChartElement(): Element | null {
    return document.querySelector(`#${this.summaryChartId}`);
  }

  isDetailChartActivated(): boolean {
    let detailChartEl = this.getDetailChartElement();
    if (!detailChartEl) return false;
    return detailChartEl.classList.contains(
      FmsAlertCardComponent.CHART_CLASS.ACTIVE,
    );
  }

  activateChartDetail(): void {
    let summaryChartEl = this.getSummaryChartElement();
    let detailChartEl = this.getDetailChartElement();
    if (!detailChartEl || !summaryChartEl) return;
    summaryChartEl.classList.add(
      FmsAlertCardComponent.CHART_CLASS.DETAIL_ACTIVATED,
    );
    detailChartEl.classList.add(FmsAlertCardComponent.CHART_CLASS.ACTIVE);
  }

  deactivateChartDetail(): void {
    let summaryChartEl = this.getSummaryChartElement();
    let detailChartEl = this.getDetailChartElement();
    if (!detailChartEl || !summaryChartEl) return;
    summaryChartEl.classList.remove(
      FmsAlertCardComponent.CHART_CLASS.DETAIL_ACTIVATED,
    );
    detailChartEl.classList.remove(FmsAlertCardComponent.CHART_CLASS.ACTIVE);
    this.violatedDevices = <ViolatedDeviceModel>{};
  }

  getAllAlerts(startDate: Date, endDate: Date): void {
    this.blackDomain$ = this.getAlertWithInterval(
      this.unitId,
      Constant.EVENT_FMS.BLACK_DOMAIN,
      startDate,
      endDate,
    );

    this.internet$ = this.getAlertWithInterval(
      this.unitId,
      Constant.EVENT_FMS.INTERNET,
      startDate,
      endDate,
    );

    this.malware$ = this.getAlertWithInterval(
      this.unitId,
      Constant.EVENT_FMS.MALWARE,
      startDate,
      endDate,
    );
  }

  getAlertWithInterval(
    ID: string,
    event: EventTypeFMS,
    startDate: Date,
    endDate: Date,
  ): Observable<Statistic> {
    return interval(Constant.TIMER.ALERT_INTERVAL).pipe(
      startWith(0),
      switchMap(() => this.getAlertsByEvent(ID, event, startDate, endDate)),
    );
  }

  getAlertsByEvent(
    unitId: string,
    event: EventTypeFMS,
    startDate: Date,
    endDate: Date,
  ): Observable<Statistic> {
    return this.fmsService
      .countWarningGroupByDevice(
        unitId,
        event,
        formatDateForElasticsearch(startDate),
        formatDateForElasticsearch(endDate),
      )
      .pipe(
        distinctUntilChanged(),
        map(
          (response: ResponseAPI<StatisticsWarningGroupByDevice[]>) =>
            response.data,
        ),
        map((data: StatisticsWarningGroupByDevice[]) => {
          return data.slice(1);
        }),
        map((data: StatisticsWarningGroupByDevice[]): Statistic => {
          if (!data.length) return <Statistic>{};
          return this.convertAPIToStatistic(data);
        }),
      );
  }

  convertAPIToStatistic(data: StatisticsWarningGroupByDevice[]): Statistic {
    return {
      units: data.length,
      amount: data.reduce(
        (accumulator, currentValue) => accumulator + currentValue.macs.length,
        0,
      ),
      detail: data,
    };
  }

  updateDetailChart(selectedData: Statistic, event: EventTypeFMS): void {
    this.violatedDevices = {
      id: this.unitId,
      units: selectedData.units,
      detail: selectedData.detail,
      alerts: selectedData.amount,
      event: event,
    };
  }

  openSecondaryModal(unitId: string, event: EventTypeFMS): void {
    this.getAlertsByEvent(
      unitId,
      event,
      this.startDate,
      this.endDate,
    ).subscribe({
      next: (data: Statistic) => {
        this.createStatisticViolatedDeviceModal({
          id: unitId,
          units: data.units,
          detail: data.detail,
          alerts: data.amount,
          event: event,
        });
      },
    });
  }

  createStatisticViolatedDeviceModal(
    violatedDevice: ViolatedDeviceModel,
  ): void {
    const listModal = this.modal.open(StatisticViolatedDeviceComponent, {
      windowClass: 'custom-modal',
    });

    listModal.componentInstance.violatedDevice = violatedDevice;
  }
}
