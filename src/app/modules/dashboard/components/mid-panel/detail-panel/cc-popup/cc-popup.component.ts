import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnChartLeftPanelComponent } from './column-chart-left-panel/column-chart-left-panel.component';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from './table-detail-fms/table-detail-1.component';
import { CONFIG } from 'src/environments/environment';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';
@Component({
  selector: 'app-cc-popup',
  standalone: true,
  imports: [
    CommonModule,
    StatisticPieChartPopupComponent,
    TableDetail1Component,
    ColumnChartLeftPanelComponent,
  ],
  templateUrl: './cc-popup.component.html',
  styleUrls: ['./cc-popup.component.scss'],
})
export class CCPopupComponent implements OnInit {
  @Input() mainType: string = '';

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieData: any[];
  columnData: any[] = [];
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
    let response = await fetch(
      `${
        CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL
      }/api/DSTindht?page=${1}&page_size=${8}`,
    );
    let tempTable = await response.json();
    this.tableData = tempTable;

    this.cdr.detectChanges();
  }
}
