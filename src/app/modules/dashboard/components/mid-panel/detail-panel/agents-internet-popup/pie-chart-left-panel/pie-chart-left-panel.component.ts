import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabel,
  AccumulationDataLabelService,
  AccumulationDataLabelSettingsModel,
  AccumulationLegendService,
  AccumulationTooltipService,
  ChartModule,
  PieSeriesService,
} from '@syncfusion/ej2-angular-charts';

// @ts-ignore
@Component({
  selector: 'app-pie-chart-left-panel',
  standalone: true,
  imports: [CommonModule, AccumulationChartModule, ChartModule],
  providers: [
    PieSeriesService,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    AccumulationAnnotationService,
  ],
  templateUrl: './pie-chart-left-panel.component.html',
  styleUrls: ['./pie-chart-left-panel.component.scss'],
})
export class PieChartLeftPanelComponent implements OnInit {
  @Input() pieData: any[];
  @Input() id: string;

  public legendSettings: Object;
  public nuanceColors: string[];
  public nuanceDataLabel: AccumulationDataLabelSettingsModel;

  private cdr = inject(ChangeDetectorRef);
  dataMapping: any[] = [];
  ngOnInit(): void {
    this.nuanceDataLabel = {
      visible: true,
      name: 'y',
      position: 'Outside',
      textOverflow: 'Ellipsis',
      maxWidth: 300,
      font: {
        textAlignment: 'Near',
        textOverflow: 'Wrap',
        size: '3em',
      },
      // template: '<div class=\'fw-bold\' style="font-size: 2.5rem;">${point.percentage} %</div>'
    };
    this.legendSettings = {
      visible: true,
      position: 'Bottom',
      textStyle: {
        size: '4em',
        textAlignment: 'Center',
      },
      shapeWidth: 30,
      shapeHeight: 30,
      itemPadding: 40,
    };
    // this.nuanceColors = ['#045E2B', '#F58501'];
    this.nuanceColors = [
      'rgba(255, 87, 51, 1)',
      'rgba(255, 160, 122, 1)',
      'rgba(255, 69, 0, 1)',
      'rgba(255, 99, 71, 1)',
      'rgba(255, 20, 147, 1)',
      'rgba(255, 105, 180, 1)',
      'rgba(255, 182, 193, 1)',
      'rgba(255, 192, 203, 1)',
      'rgba(221, 160, 221, 1)',
      'rgba(218, 112, 214, 1)',
    ];
    this.cdr.detectChanges();
  }
}
