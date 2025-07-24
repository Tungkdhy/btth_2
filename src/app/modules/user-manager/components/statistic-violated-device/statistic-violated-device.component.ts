import { Component, inject, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ViolatedDeviceDataTableComponent } from '../../../topology/components/violated-device-data-table/violated-device-data-table.component';
import { ViolatedDeviceDataTablePcoComponent } from '../violated-device-data-table-pco/violated-device-data-table-pco.component';
import { ChartViolatedDeviceComponent } from '../chart-violated-device/chart-violated-device.component';
import { ViolatedDeviceModel } from '../../../topology/models/violated-device.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticsViolatingDeviceListComponent } from '../../../statistics/components/statistics-violating-device-list/statistics-violating-device-list.component';

@Component({
  selector: 'app-statistic-violated-device',
  templateUrl: './statistic-violated-device.component.html',
  styles: [],
  imports: [
    ChartViolatedDeviceComponent,
    ViolatedDeviceDataTableComponent,
    NgIf,
    ViolatedDeviceDataTablePcoComponent,
    StatisticsViolatingDeviceListComponent,
  ],
  standalone: true,
})
export class StatisticViolatedDeviceComponent implements OnInit {
  @Input() violatedDevice: ViolatedDeviceModel;
  @Input() isFmsAlert: boolean = true;

  modal = inject(NgbActiveModal);

  ngOnInit() {}

  goBack() {
    this.modal.close();
  }
}
