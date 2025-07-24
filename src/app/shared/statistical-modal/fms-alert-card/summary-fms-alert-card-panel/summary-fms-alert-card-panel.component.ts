import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ChartOptions,
  DataPoint,
} from '../../../../core/models/apex-chart-options.model';
import { Constant } from '../../../../core/config/constant';
import { EventTypeFMS } from '../../../../core/models/fms.model';
import { formatNumberWithDot } from '../../../../modules/digital-map/services/utils';
import { Statistic } from '../../../../modules/statistics/models/statistics.model';

@Component({
  selector: 'app-summary-fms-alert-card-panel',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './summary-fms-alert-card-panel.component.html',
  styleUrls: ['./summary-fms-alert-card-panel.component.scss'],
})
export class SummaryFmsAlertCardPanelComponent implements OnChanges {
  public chartOptions: ChartOptions;
  @Input() internetAlert: Statistic;
  @Input() blackDomainAlert: Statistic;
  @Input() malwareAlert: Statistic;

  @Output() selectDataPoint = new EventEmitter<DataPoint>();

  alertChartData: number[] = Array.from(Array(3).fill(null));
  unitChartData: number[] = Array.from(Array(3).fill(null));
  dataPoint: Statistic[] = Array.from(Array(3).fill(null));

  private EVENT: any = {
    POLICY: {
      LABEL: 'POLICY',
      INDEX: 0,
    },
    BLACK_DOMAIN: {
      LABEL: 'BLACK_DOMAIN',
      INDEX: 1,
    },
    MALWARE: {
      LABEL: 'MALWARE',
      INDEX: 2,
    },
  };
  constructor() {
    this.setupChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.internetAlert) {
      const internetAlert = changes.internetAlert.currentValue;
      this.updateChartDataList(this.EVENT.POLICY.LABEL, internetAlert);
    }
    if (changes.blackDomainAlert) {
      const blackDomainAlert = changes.blackDomainAlert.currentValue;
      this.updateChartDataList(this.EVENT.BLACK_DOMAIN.LABEL, blackDomainAlert);
    }
    if (changes.malwareAlert) {
      const malwareAlert = changes.malwareAlert.currentValue;
      this.updateChartDataList(this.EVENT.MALWARE.LABEL, malwareAlert);
    }
  }

  setupChart() {
    const self = this;
    this.chartOptions = {
      series: [
        {
          name: Constant.CHART.LABEL.DEVICE,
          data: this.alertChartData,
        },
        {
          name: Constant.CHART.LABEL.UNIT,
          data: this.unitChartData,
        },
      ],
      chart: {
        type: 'bar',
        height: 430,
        events: {
          dataPointSelection(e: any, chart?: any, options?: any) {
            if (options.selectedDataPoints[options.seriesIndex].length === 1) {
              self.selectDataPoint.emit({
                hasDataPointSelect: true,
                selectedData: self.dataPoint[options.dataPointIndex],
                eventType: self.getEventTypeFMSByIndex(options.dataPointIndex),
              });
            }

            if (options.selectedDataPoints[options.seriesIndex].length === 0) {
              self.selectDataPoint.emit({
                hasDataPointSelect: false,
              });
            }
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          columnWidth: '55%',
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: 20,
        offsetY: 7,
        textAnchor: 'middle',
        style: {
          fontSize: '1rem',
          colors: [Constant.CHART.COLORS.DATA_LABEL],
        },
        background: {
          enabled: false,
        },
        formatter(val: string | number | number[]): string | number {
          return formatNumberWithDot(val);
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: [
          Constant.CHART.CATEGORIES.LABEL_XAXIS.INTERNET,
          Constant.CHART.CATEGORIES.LABEL_XAXIS.BLACK_DOMAIN,
          Constant.CHART.CATEGORIES.LABEL_XAXIS.MALWARE,
        ],
        labels: {
          show: true,
          style: {
            fontSize: '11px',
          },
          formatter(value: string): string | string[] {
            return formatNumberWithDot(value);
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
          rotate: -90,
          align: 'center',
          style: {
            fontSize: '9px',
          },
        },
      },
      colors: [Constant.CHART.COLORS.ALERT, Constant.CHART.COLORS.UNIT],
    };
  }

  getEventTypeFMSByIndex(index: number): EventTypeFMS | null {
    switch (index) {
      case this.EVENT.POLICY.INDEX:
        return this.EVENT.POLICY.LABEL;
      case this.EVENT.BLACK_DOMAIN.INDEX:
        return this.EVENT.BLACK_DOMAIN.LABEL;
      case this.EVENT.MALWARE.INDEX:
        return this.EVENT.MALWARE.LABEL;
      default:
        return null;
    }
  }

  isValueAlertNone(value: Statistic): boolean {
    if (!value || value.amount === 0) return true;
    return Object.keys(value).length === 0;
  }

  updateChartDataList(event: EventTypeFMS, chartData: Statistic): void {
    if (this.isValueAlertNone(chartData)) return;
    switch (event) {
      case this.EVENT.POLICY.LABEL:
        this.alertChartData[0] = chartData.amount;
        this.unitChartData[0] = chartData.units;
        this.dataPoint[0] = chartData;
        break;
      case this.EVENT.BLACK_DOMAIN.LABEL:
        this.alertChartData[1] = chartData.amount;
        this.unitChartData[1] = chartData.units;
        this.dataPoint[1] = chartData;
        break;
      case this.EVENT.MALWARE.LABEL:
        this.alertChartData[2] = chartData.amount;
        this.unitChartData[2] = chartData.units;
        this.dataPoint[2] = chartData;
        break;
    }
  }
}
