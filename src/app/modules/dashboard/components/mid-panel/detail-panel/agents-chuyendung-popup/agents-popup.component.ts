import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartLeftPanelComponent } from './pie-chart-left-panel/pie-chart-left-panel.component';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { ColumnChartLeftPanelComponent } from './column-chart-left-panel/column-chart-left-panel.component';

interface EndpointData {
  count: number;
  version: string | null;
}

interface DataInput {
  endpoint_fms: EndpointData[];
  endpoint_ta21: EndpointData[];
  endpoint_fidelis: EndpointData[];
}

interface TransformedData {
  x: string;
  y: number;
}

interface TransformedResult {
  endpoint_fms: TransformedData[];
  endpoint_ta21: TransformedData[];
  endpoint_fidelis: TransformedData[];
}
function transformData(data: DataInput): TransformedResult {
  const transformEntry = (entry: EndpointData): TransformedData => ({
    x: entry.version || 'Chưa xác định',
    y: entry.count,
  });

  return {
    endpoint_fms: data.endpoint_fms.map(transformEntry),
    endpoint_ta21: data.endpoint_ta21.map(transformEntry),
    endpoint_fidelis: data.endpoint_fidelis.map(transformEntry),
  };
}

@Component({
  selector: 'app-agents-chuyendung-popup',
  standalone: true,
  imports: [
    CommonModule,
    PieChartLeftPanelComponent,
    ColumnChartLeftPanelComponent,
  ],
  templateUrl: './agents-popup.component.html',
  styleUrls: ['./agents-popup.component.scss'],
})
export class AgentsChuyenDungPopupComponent implements OnInit {
  columnDataMMS: any[] = [];
  columnDataNextAV: any[] = [];
  @Input() mainType: string = '';

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieDataFMS: any[];
  pieDataTA21: any[];

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    let thongKeFMS_FMC = await this.supabase.getVersionCDCounts();
    this.pieDataFMS = thongKeFMS_FMC.endpoint_fms;
    this.columnDataMMS = thongKeFMS_FMC.endpoint_fms?.sort((a: any, b: any) => {
      if (a?.x > b?.x) return -1;
      if (a?.x < b?.x) return 1;
      return 0;
    });
    this.pieDataTA21 = thongKeFMS_FMC.endpoint_ta21;
    this.columnDataNextAV = thongKeFMS_FMC.endpoint_ta21?.sort(
      (a: any, b: any) => {
        if (a?.x > b?.x) return -1;
        if (a?.x < b?.x) return 1;
        return 0;
      },
    );
    this.cdr.detectChanges();
  }
}
