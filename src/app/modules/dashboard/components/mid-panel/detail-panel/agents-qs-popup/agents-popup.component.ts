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
import { ColumnChartLeftPanelComponent } from './column-chart-left-panel/column-chart-left-panel.component';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
interface EndpointData {
  count: number;
  version: string;
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
    x: entry.version,
    y: entry.count,
  });

  const sortByXDescending = (a: TransformedData, b: TransformedData) => {
    if (a.x > b.x) return -1;
    if (a.x < b.x) return 1;
    return 0;
  };

  return {
    endpoint_fms: data.endpoint_fms.map(transformEntry).sort(sortByXDescending).filter(data=>data.x!==""&&data.x!=="NULL" && data.x !==null),
    endpoint_ta21: data.endpoint_ta21
      .map(transformEntry)
      .sort(sortByXDescending).filter(data=>data.x!==""&&data.x!=="NULL" && data.x !==null),
    endpoint_fidelis: data.endpoint_fidelis
      .map(transformEntry)
      .sort(sortByXDescending).filter(data=>data.x!==""&&data.x!=="NULL" && data.x !==null),
  };
}

@Component({
  selector: 'app-agents-qs-popup',
  standalone: true,
  imports: [
    CommonModule,
    PieChartLeftPanelComponent,
    ColumnChartLeftPanelComponent,
  ],
  templateUrl: './agents-popup.component.html',
  styleUrls: ['./agents-popup.component.scss'],
})
export class AgentsQsPopupComponent implements OnInit {
  @Input() mainType: string = '';

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieDataFMS: any[];
  pieDataTA21: any[];
  pieDataFidelis: any[];
  columnDataFMS: any[] = [];
  columnDataTA21: any[] = [];
  columnDataFidelis: any[] = [];
  tableData: any;

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    if (!localStorage.getItem('getUnit')) {
      let getUnits = await this.supabase.getUnit();
      localStorage.setItem('getUnit', JSON.stringify(getUnits));
    }

    let thongKeFMS_FMC = await this.supabase.getVersionQSCounts();
    const transformedData = transformData(thongKeFMS_FMC.items);
    this.pieDataFMS = transformedData.endpoint_fms;
    this.columnDataFMS = transformedData.endpoint_fms;
    this.pieDataTA21 = transformedData.endpoint_ta21;
    this.columnDataTA21 = transformedData.endpoint_ta21;
    this.pieDataFidelis = transformedData.endpoint_fidelis;
    this.columnDataFidelis = transformedData.endpoint_fidelis;
    this.cdr.detectChanges();
  }
}
