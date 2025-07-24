import { map } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnChartLeftPanelComponent } from './column-chart-left-panel/column-chart-left-panel.component';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from './table-detail-fms/table-detail-1.component';
import { CONFIG } from 'src/environments/environment';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationDataLabelSettingsModel,
  AccumulationLegendService,
  AccumulationTooltipService,
  ChartModule,
} from '@syncfusion/ej2-angular-charts';
import {
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NumberFormatPipe } from 'src/app/core/pipes/number-format/number-format.pipe';
import { botData, serverData } from './mockData';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';
@Component({
  selector: 'app-ct86-popup',
  standalone: true,
  providers: [
    AccumulationDataLabelService,
    AccumulationTooltipService,
    AccumulationLegendService,
    AccumulationAnnotationService,
  ],
  imports: [
    CommonModule,
    TableDetail1Component,
    ColumnChartLeftPanelComponent,
    NgbPagination,
    FormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NumberFormatPipe,
    AccumulationChartModule,
    ChartModule,
    StatisticPieChartPopupComponent
  ],
  templateUrl: './chi-tiet-nhiem-vu-full-popup.component.html',
  styleUrls: ['./chi-tiet-nhiem-vu-full-popup.component.scss'],
})
export class CT86PopupComponent implements OnInit {
  @Input() mainType: string = '';

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieData: any[];
  columnData: any[] = [];
  tableData: any;
  chartData: any[] = [];
  page = 1;
  pageSize = 5;
  total = 10;
  public ct86Title: string;
  public ct86legendSettings: Object;
  public centerLabel?: Object;
  public ct86DataLabel: Object;
  public ct86Colors: string[];

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  formatDate(date: any) {
    const dateObj = new Date(date);
    const formattedDate = `${String(dateObj.getDate()).padStart(
      2,
      '0',
    )}-${String(dateObj.getMonth() + 1).padStart(
      2,
      '0',
    )}-${dateObj.getFullYear()}`;

    return formattedDate;
  }

  async ngOnInit() {
    this.ct86DataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold custom-color-text\' style="font-size: 2rem;">${point.percentage}%</div>',
    };
    this.ct86Colors = ['#045E2B', '#1D85E7', '#D00B32'];
    this.ct86legendSettings = {
      visible: true,
      position: 'Right',
      textStyle: {
        size: '2rem',
        textAlignment: 'Center',
      },
      margin: 0,
      shapeWidth: 30,
      shapeHeight: 30,
      itemPadding: 40,
      padding: 0,
    };
    await this.updateData();
    // if (!localStorage.getItem('getUnit')) {
    //   let getUnits = await this.supabase.getUnit();
    //   localStorage.setItem('getUnit', JSON.stringify(getUnits));
    // }
    // let response = await fetch(
    //   `${
    //     CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL
    //   }/api/DSTindht?page=${1}&page_size=${8}`,
    // );
    // let tempTable = await response.json();
    // this.tableData = tempTable;
  }

  async updateData() {
    let botData = await this.supabase.trang_thai_bot_ct86();
    this.tableData = await this.supabase.tctt_trang_thai_server_ct86();
    this.columnData = await this.supabase.trang_thai_bot_ct86();
    this.tableData = this.tableData.map((item: any) => {
      return { ...item, tendonvi: this.transformUnitName(item?.tendonvi) };
    });
    this.chartData = botData.map((item: any) => ({
      unitName: this.transformUnitName(item?.tendonvi),
      thongke: item?.soluong,
    }));
    this.columnData = this.columnData.map((item: any) => {
      return { ...item, tendonvi: this.transformUnitName(item?.tendonvi) };
    });
    this.cdr.detectChanges();
  }

  transformUnitName(tendonvi: string): string {
    switch (tendonvi) {
      case 'Trung tâm 186':
        return 'Miền Bắc';
      case 'Trung tâm 286':
        return 'Miền Trung';
      case 'Trung tâm 386':
        return 'Miền Nam';
      default:
        return tendonvi;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      // Perform actions based on the 'mainType' input change
      console.log('mainType has changed:', changes['chartData'].currentValue);
    }
  }
}
