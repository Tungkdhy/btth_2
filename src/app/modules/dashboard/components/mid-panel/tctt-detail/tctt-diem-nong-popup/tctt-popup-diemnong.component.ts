import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  inject,
  ChangeDetectorRef,
  ViewChild,
  SimpleChanges,
  ViewEncapsulation,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {
  GridModule,
  EditService,
  ToolbarService,
  PageService,
  FilterService,
  GridComponent,
} from '@syncfusion/ej2-angular-grids';
import { diemNongType } from 'src/app/modules/dashboard/models/btth.interface';
import { DiemNongPieChartComponent } from './diem-nong-pie-chart/diem-nong-pie-chart.component';
import { DiemNongLineChartComponent } from './diem-nong-line-chart/diem-nong-line-chart.component';
import { BreadcrumLeftRightComponent } from "../../../shared/breadcrum-left-right/breadcrum-left-right.component";
@Component({
  selector: 'app-tctt-diemnong-popup',
  templateUrl: './tctt-popup-diemnong.component.html',
  styleUrls: ['./tctt-popup-diemnong.component.scss'],
  standalone: true,
  // imports: [CommonModule, FormsModule, NgbPagination],
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    NgbPaginationModule,
    DiemNongPieChartComponent,
    DiemNongLineChartComponent,
    BreadcrumLeftRightComponent
],
  providers: [EditService, ToolbarService, PageService],
  encapsulation: ViewEncapsulation.None,
})
export class TcttDiemNongPopupComponent implements OnInit, OnChanges {
  public searchText: string = '';
  receivedData: any[] = [];
  receivedLabel: string;
  receivedStatusData: any[] = [];
  receivedStatisticData: any[] = [];
  page: number = 1;
  pageSize: number = 10;

  public updatedData: any[] = [];

  private cdr = inject(ChangeDetectorRef);

  public pageSettings = {};
  @Input() dataDetail: any;
  @ViewChild('grid') public grid: GridComponent;

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  get filteredData(): any {
    const searchLower = this.searchText.toString().toLowerCase();
    if (this.receivedLabel === diemNongType.KHU_CONG_NGHIEP) {
      return this.updatedData
        .filter(
          (item) =>
            item?.ten?.toString().toLowerCase().includes(searchLower) ||
            item?.diachi?.toString().toLowerCase().includes(searchLower) ||
            item?.diaban?.toString().toLowerCase().includes(searchLower),
        )
        .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    } else if (this.receivedLabel === diemNongType.BOT) {
      return this.updatedData
        .filter(
          (item) =>
            item?.ten?.toString().toLowerCase().includes(searchLower) ||
            item?.diachi?.toString().toLowerCase().includes(searchLower) ||
            item?.chudautu?.toString().toLowerCase().includes(searchLower) ||
            item?.diaban?.toString().toLowerCase().includes(searchLower),
        )
        .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    } else if (this.receivedLabel === diemNongType.GIAO_XU) {
      return this.updatedData
        .filter(
          (item) =>
            item?.tengiaoxu?.toString().toLowerCase().includes(searchLower) ||
            item?.tengiaohat?.toString().toLowerCase().includes(searchLower) ||
            item?.tengiaophan?.toString().toLowerCase().includes(searchLower) ||
            item?.diachi?.toString().toLowerCase().includes(searchLower),
        )
        .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    } else {
      return [];
    }
  }

  updateData(): void {
    this.updatedData = this.receivedData?.map((item: any, index: any) => ({
      ...item,
      index: index + 1,
    }));
    this.cdr.markForCheck();
  }

  constructor() {}

  renderDiemNongScreen(): string {
    if (this.receivedLabel === diemNongType.BOT) return 'BOT';
    else if (this.receivedLabel === diemNongType.KHU_CONG_NGHIEP) return 'CN';
    return 'GS';
  }

  ngOnInit(): void {
    this.pageSettings = {
      pageSize: 8,
      currentPage: 1,
      enablePageNumbers: true,
    };
    this.receivedStatisticData = this.dataDetail.statisticData;
    this.receivedStatusData = this.dataDetail.statusData;    
    this.updateData();
    this.renderDiemNongScreen();
  }

  onPageChange(page: number) {
    this.page === page;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataDetail']) {
      const currentValue = changes['dataDetail'].currentValue;

      if (currentValue?.dataDetail) {
        this.receivedData = currentValue.dataDetail.data.map((item: any) => ({
          ...item,
          diachi: item.diachi || 'Chưa có số liệu',
        }));
        this.receivedLabel = currentValue.dataDetail.labelName;
        this.receivedStatusData = currentValue.statusData;
        this.receivedStatisticData = currentValue.statisticData;
        this.updateData();
      }
    }
  }
  // xử lý sự kiện đóng popup từ component con tới component cha
  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
}
