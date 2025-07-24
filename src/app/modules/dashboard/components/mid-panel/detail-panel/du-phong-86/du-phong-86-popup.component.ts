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
  selector: 'app-du-phong-86-popup',
  standalone: true,
  imports: [
    CommonModule,
    TableDetail1Component,
    ColumnChartLeftPanelComponent,
    StatisticPieChartPopupComponent
  ],
  templateUrl: './du-phong-86-popup.component.html',
  styleUrls: ['./du-phong-86-popup.component.scss'],
})
export class DuPhong86PopupComponent implements OnInit {
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
    // this.columnData = (await this.supabase.getDanhSachDuPhong86_2())?.items;
    // console.log('column data', this.columnData);
  }
}
