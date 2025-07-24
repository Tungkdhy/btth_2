import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnChartLeftPanelComponent } from '../shared/column-chart-left-panel/column-chart-left-panel.component';
import { TableDetail1Component } from '../shared/table-detail-1/table-detail-1.component';
import { TableDetail2Component } from "../shared/table-detail-2/table-detail-2.component";
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-intel-info',
  templateUrl: './intel-information.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ColumnChartLeftPanelComponent,
    TableDetail1Component,
    TableDetail2Component,
    StatisticPieChartPopupComponent
],
  styleUrls: ['./intel-information.component.scss'],
})
export class IntelInformationComponent {
  // pieData: any[] = [
  //   { status: 'Dang hoat dong', quantity: 343, test: 'a' },
  //   { status: 'Mat ket noi', quantity: 30, test: 'b' },
  // ];
  pieData: any[] = [
    { x: 'Dang hoat dong', y: 343 },
    { x: 'Mat ket noi', y: 245 },
  ];

  columnData: any[] = [
    {
      name: 'BQP',
      connect: 8,
      disconnect: 20,
    },
    {
      name: 'VPTWD',
      connect: 10,
      disconnect: 20,
    },
    {
      name: 'VPCTN',
      connect: 20,
      disconnect: 20,
    },
  ];
}
