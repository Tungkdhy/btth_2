import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataChart } from '../../shared/datatype';
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
  onChartClick(args: any): void {
    if (args.point) {
      const clickedPoint = args.point;
      console.log('Clicked x value:', clickedPoint.x);
      console.log('Clicked y value:', clickedPoint.y);
      
      // You can now perform any actions you want with the x and y values
      // For example, emit an event, update a service, or change component state
    }
  }
  ngOnInit(): void {
    this.nuanceDataLabel = {
      visible: true,
      name: 'y',
      position: 'Outside',
      textOverflow: 'Ellipsis',
      maxWidth: 0,
      font: {
        textAlignment: 'Near',
        textOverflow: 'Wrap',
        size: '2em',
      },
      // template: '<div class=\'fw-bold\' style="font-size: 2.5rem;">${point.percentage} %</div>'
    };
    this.legendSettings = {
      visible: true,
      position: 'Bottom',
      textStyle: {
        size: '2em',
        textAlignment: 'Center',
      },
      shapeWidth: 30,
      shapeHeight: 30,
      itemPadding: 40,
    };
    this.nuanceColors = ['#045E2B', '#F58501'];
    this.cdr.detectChanges();
  }
}
