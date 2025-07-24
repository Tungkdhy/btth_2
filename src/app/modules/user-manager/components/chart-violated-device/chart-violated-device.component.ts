import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ViolatedDeviceModel } from '../../../topology/models/violated-device.model';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { NgIf } from '@angular/common';
import { ChartOptions } from '../../../../core/models/apex-chart-options.model';
import { formatNumberWithDot } from '../../../digital-map/services/utils';
import { StatisticsWarningGroupByDevice } from '../../../statistics/models/statistics.model';
import { Constant } from '../../../../core/config/constant';

interface ChartData {
  name: string[];
  value: number[];
}

@Component({
  selector: 'app-chart-violated-device',
  templateUrl: './chart-violated-device.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
  imports: [NgApexchartsModule, NgIf],
  standalone: true,
})
export class ChartViolatedDeviceComponent {
  get violatedDevice(): ViolatedDeviceModel {
    return this._violatedDevice;
  }

  @Input()
  set violatedDevice(value: ViolatedDeviceModel) {
    console.log(value);
    this._violatedDevice = value || <ViolatedDeviceModel>{};
    this.chartData = this.setBarChartData(this._violatedDevice);
    this.chartOptions = this.setChartOptions(this.chartData);
    this.cdr.markForCheck();
  }
  private _violatedDevice: ViolatedDeviceModel = <ViolatedDeviceModel>{};

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: ChartOptions;

  chartData: ChartData;

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor() {}

  setBarChartData(devices: ViolatedDeviceModel): ChartData {
    const alerts = this.sortArrayByCountAscending(devices);
    return {
      name: [
        ...alerts.map((item) => {
          let name = item.name;
          if (!name) name = 'Không xác định';
          return name;
        }),
      ],
      value: [...alerts.map((item) => item.macs.length)],
    };
  }

  sortArrayByCountAscending(
    devices: ViolatedDeviceModel,
  ): StatisticsWarningGroupByDevice[] {
    return devices.detail.sort((a, b) => a.macs.length - b.macs.length);
  }
  setChartOptions(chartData: ChartData): ChartOptions {
    return {
      series: [
        {
          name: Constant.CHART.LABEL.DEVICE,
          data: chartData.value,
        },
      ],
      chart: {
        type: 'bar',
        height: 550,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter(val: string | number | number[]): string | number {
          return formatNumberWithDot(val);
        },
      },
      xaxis: {
        categories: chartData.name,
        labels: {
          formatter(value: string): string | string[] {
            return formatNumberWithDot(value);
          },
        },
      },
    };
  }
}
