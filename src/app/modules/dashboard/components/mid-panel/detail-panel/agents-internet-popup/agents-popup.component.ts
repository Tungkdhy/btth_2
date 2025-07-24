import { filter } from 'rxjs';
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
  endpoint_ta21: EndpointData[];
  endpoint_fidelis: EndpointData[];
}
interface TransformedData {
  x: string;
  y: number;
}

interface TransformedResult {
  endpoint_ta21: TransformedData[];
  endpoint_fidelis: TransformedData[];
}
function transformData(data: DataInput): TransformedResult {
  const transformEntry = (entry: EndpointData): TransformedData => ({
    x: entry.version || 'Chưa xác định',
    y: entry.count,
  });

  return {
    endpoint_ta21: data.endpoint_ta21.map(transformEntry),
    endpoint_fidelis: data.endpoint_fidelis.map(transformEntry),
  };
}

@Component({
  selector: 'app-agents-int-popup',
  standalone: true,
  imports: [
    CommonModule,
    PieChartLeftPanelComponent,
    ColumnChartLeftPanelComponent,
  ],
  templateUrl: './agents-popup.component.html',
  styleUrls: ['./agents-popup.component.scss'],
})
export class AgentsINTPopupComponent implements OnInit {
  columnDataFidelis: any[] = [];
  columnDataTA21: any[] = [];
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
    let thongKeFMS_FMC = await this.supabase.getVersionINTCounts();
    console.log(thongKeFMS_FMC);
    this.columnDataTA21 = thongKeFMS_FMC.endpoint_ta21
      ?.filter((data: any) => data?.x !== null && data?.x !== 'NULL')
      .sort((a: any, b: any) => {
        if (a?.x > b?.x) return -1;
        if (a?.x < b?.x) return 1;
        return 0;
      });
    this.columnDataTA21 = this.columnDataTA21.map((item) => ({
      x: item.version,
      y: item.count,
    }));
    this.columnDataFidelis = thongKeFMS_FMC.endpoint_soci
      ?.filter((data: any) => data?.x !== null && data?.x !== 'NULL')
      .sort((a: any, b: any) => {
        if (a?.x > b?.x) return -1;
        if (a?.x < b?.x) return 1;
        return 0;
      });
    this.columnDataFidelis = this.columnDataFidelis.map((item) => ({
      x: item.version,
      y: item.count,
    }));
    console.log(this.columnDataFidelis);
    this.cdr.detectChanges();
  }
}
