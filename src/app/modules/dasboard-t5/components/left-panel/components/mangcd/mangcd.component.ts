import { Component } from '@angular/core';
import { TablePtmComponent } from '../../../shared/table-ptm/table-ptm.component';
import { StackChart } from '../../../shared/stack-chart/stack-chart.component';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { PipeChartConfig } from '../../../shared/pie-chart/pipe-chart.config';
import { StackChartConfig } from '../../../shared/stack-chart/stack-chart.config';
import { StackChartHori } from '../../../shared/stack-chart-hori/stack-chart-hori.component';

import { HeaderChartComponent } from '../../../shared/header-chart/header-chart.component';
@Component({
  selector: 'app-mangcd',
  templateUrl: './mangcd.component.html',
  styleUrls: ['./mangcd.component.scss'],
  standalone: true,
  imports: [TablePtmComponent, StackChartHori, StackChart, PieChartComponent, HeaderChartComponent],
})
export class MangcdComponent {
  
  getLevelOnly(name: string): string {
    const parts = name.split(' ');  // Tách theo dấu cách
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : name;
  }
}
