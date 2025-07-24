import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { EventTypeFMS } from './fms.model';

import { Statistic } from '../../modules/statistics/models/statistics.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  colors?: string[];
  tooltip?: ApexTooltip;
  stroke?: ApexStroke;
  fill?: ApexFill;
  title?: ApexTitleSubtitle;
  theme?: ApexTheme;
  legend?: ApexLegend;
};

export type ChartOptionsNonAxis = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
};

export interface DataPoint {
  hasDataPointSelect: boolean;
  vendorType?: string;
  selectedData?: Statistic;
  eventType?: EventTypeFMS | null;
}
