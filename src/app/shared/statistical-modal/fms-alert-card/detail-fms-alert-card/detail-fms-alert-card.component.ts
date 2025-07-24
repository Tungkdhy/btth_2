// import {
//   ChangeDetectorRef,
//   Component,
//   EventEmitter,
//   inject,
//   Input,
//   Output,
//   ViewChild,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
// import { Constant } from '../../../../core/config/constant';
// import { EventTypeFMS } from '../../../../core/models/fms.model';
// import { ViolatedDeviceModel } from '../../../../modules/topology/models/violated-device.model';
// import { ChartOptions } from '../../../../core/models/apex-chart-options.model';
// import { formatNumberWithDot } from '../../../../modules/digital-map/services/utils';
// import { StatisticsWarningGroupByDevice } from '../../../../modules/statistics/models/statistics.model';

// interface ChartData {
//   name: string[];
//   value: number[];
// }

// @Component({
//   selector: 'app-detail-fms-alert-card',
//   standalone: true,
//   imports: [CommonModule, NgApexchartsModule],
//   templateUrl: './detail-fms-alert-card.component.html',
//   styleUrls: ['./detail-fms-alert-card.component.scss'],
// })
// export class DetailFmsAlertCardComponent {
//   get violatedDevice(): Required<ViolatedDeviceModel> {
//     return this._violatedDevice;
//   }

//   @Input()
//   set violatedDevice(value: ViolatedDeviceModel) {
//     this._violatedDevice = value || <ViolatedDeviceModel>{};
//     this._violatedDevice.detail = this.sortArrayByCountAscending(
//       this._violatedDevice,
//     );
//     this.chartData = this.setBarChartData(this._violatedDevice);
//     this.chartOptions = this.setChartOptions(this.chartData);
//     this.cdr.markForCheck();
//   }

//   private _violatedDevice: ViolatedDeviceModel = <ViolatedDeviceModel>{};

//   @Output() chartClick = new EventEmitter<string>();

//   @ViewChild('chart') chart: ChartComponent;
//   public chartOptions: ChartOptions;

//   chartData: ChartData;

//   private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

//   constructor() {}

//   setBarChartData(devices: ViolatedDeviceModel): ChartData {
//     const alerts = devices.detail;
//     return {
//       name: [
//         ...alerts.map((item) => {
//           let name = item.name;
//           if (!name) name = 'Không xác định';
//           return name;
//         }),
//       ],
//       value: [...alerts.map((item) => item.macs.length)],
//     };
//   }

//   sortArrayByCountAscending(
//     devices: ViolatedDeviceModel,
//   ): StatisticsWarningGroupByDevice[] {
//     return devices.detail.sort((a, b) => a.macs.length - b.macs.length);
//   }

//   setChartOptions(chartData: ChartData): ChartOptions {
//     const self = this;
//     return {
//       series: [
//         {
//           name: Constant.CHART.LABEL.DEVICE,
//           data: chartData.value,
//         },
//       ],
//       chart: {
//         type: 'bar',
//         height: 550,
//         events: {
//           dataPointSelection(e: any, chart?: any, options?: any) {
//             if (options.dataPointIndex === undefined) return;
//             self.chartClick.emit(
//               self.violatedDevice.detail[options.dataPointIndex].unitId,
//             );
//           },
//         },
//       },
//       plotOptions: {
//         bar: {
//           horizontal: true,
//         },
//       },
//       dataLabels: {
//         enabled: true,
//         textAnchor: 'middle',
//         offsetY: 7,
//         style: {
//           fontSize: '1rem',
//           colors: [Constant.CHART.COLORS.DATA_LABEL],
//         },
//         background: {
//           enabled: false,
//         },
//         formatter(val: string | number | number[]): string | number {
//           return formatNumberWithDot(val);
//         },
//       },
//       xaxis: {
//         categories: chartData.name,
//         labels: {
//           formatter(value: string): string | string[] {
//             return formatNumberWithDot(value);
//           },
//         },
//       },
//       colors: [Constant.CHART.COLORS.ALERT],
//       title: {
//         text: this.getTitleByEvent(this.violatedDevice.event),
//         offsetX: 20,
//         style: {
//           fontSize: '16px',
//           fontWeight: 900,
//         },
//       },
//     };
//   }

//   getTitleByEvent(event: EventTypeFMS): string {
//     switch (event) {
//       case 'POLICY':
//         return Constant.CHART.CATEGORIES.INTERNET;
//       case 'BLACK_DOMAIN':
//         return Constant.CHART.CATEGORIES.BLACK_DOMAIN;
//       case 'MALWARE':
//         return Constant.CHART.CATEGORIES.MALWARE;
//       default:
//         return '';
//     }
//   }
// }
