import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FmsAlertCardComponent } from '../../../../../shared/statistical-modal/fms-alert-card/fms-alert-card.component';
import { PrtgAlertWidgetComponent } from '../../../../../shared/statistical-modal/prtg-alert-widget/prtg-alert-widget.component';
import {
  AccumulationChartModule,
  AxisModel,
  CategoryService,
  ChartAnnotationService,
  ChartModule,
  ColumnSeriesService,
  DateTimeService,
  LegendService,
  LegendSettingsModel,
  LineSeriesService,
  RangeColumnSeriesService,
  ScrollBarService,
  StackingColumnSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-information-warfare-stats',
  standalone: true,
  imports: [
    CommonModule,
    FmsAlertCardComponent,
    PrtgAlertWidgetComponent,
    AccumulationChartModule,
    ChartModule,
  ],
  templateUrl: './information-warfare-stats.component.html',
  styleUrls: ['./information-warfare-stats.component.scss'],
  providers: [
    CategoryService,
    DateTimeService,
    ScrollBarService,
    LineSeriesService,
    ColumnSeriesService,
    ChartAnnotationService,
    RangeColumnSeriesService,
    StackingColumnSeriesService,
    LegendService,
    TooltipService,
  ],
})
export class InformationWarfareStatsComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  public piedata?: Object[] = [
    { x: 'Jan', y: 3 },
    { x: 'Feb', y: 3.5 },
    { x: 'Mar', y: 7 },
    // { x: 'Apr', y: 13.5 },
    // {
    //   x: 'May',
    //   y: 19,
    // },
    // { x: 'Jun', y: 23.5 },
    // { x: 'Jul', y: 26 },
    // { x: 'Aug', y: 25 },
    // { x: 'Sep', y: 21 },
    // { x: 'Oct', y: 15 },
    // { x: 'Nov', y: 15 },
    // { x: 'Dec', y: 15 },
  ];
  public legendSettings: LegendSettingsModel = {
    visible: false,
  };

  public chartData?: Object[] = [
    { x: 2005, y: 28 },
    { x: 2006, y: 25 },
    { x: 2007, y: 26 },
    // { x: 2008, y: 27 },
    // { x: 2009, y: 32 },
    // { x: 2010, y: 35 },
    // { x: 2011, y: 30 },
  ];
  public title?: string;
  public primaryXAxisLine: AxisModel = {
    interval: 1,
  };
  public primaryYAxisLine: AxisModel;

  public primaryXAxisCol: AxisModel = {
    valueType: 'Category',
    title: 'Lượt xem',
  };
  public chartDataCol?: Object[] = [
    { country: '0', gold: 50 },
    { country: '1k', gold: 40 },
    { country: '2k', gold: 70 },
    // { country: 'Australia', gold: 60 },
    // { country: 'France', gold: 50 },
    // { country: 'Germany', gold: 40 },
    // { country: 'Italy', gold: 40 },
    // { country: 'Sweden', gold: 30 },
  ];
  primaryYAxisCol: AxisModel;

  ngOnInit(): void {}
}
