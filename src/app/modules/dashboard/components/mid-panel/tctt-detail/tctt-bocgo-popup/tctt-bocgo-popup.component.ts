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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GridModule,
  EditService,
  ToolbarService,
  PageService,
  GridComponent,
} from '@syncfusion/ej2-angular-grids';
import {
  formatDatePosition,
  formatNumberWithDot,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { debounceTime, Subject } from 'rxjs';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tctt-bocgo-popup',
  templateUrl: './tctt-bocgo-popup.component.html',
  styleUrls: ['./tctt-bocgo-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  // imports: [CommonModule, FormsModule, NgbPagination],
  imports: [CommonModule, FormsModule, GridModule, NgbPaginationModule],
  providers: [EditService, ToolbarService, PageService],
})
export class TcttBocgoPopupComponent implements OnInit {
  public pageSettings = {};
  @Input() dataDetail: any[] = [];
  public updatedData: any[] = [];
  public searchText: string = '';
  public totalData: number = 0;

  page: number = 1;
  pageSize: number = 10;

  private cdr = inject(ChangeDetectorRef);

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  get filteredData(): any {
    const searchLower = this.searchText.toLowerCase();
    return this.updatedData
      ?.filter(
        (item) =>
          item?.noidung_vipham?.toLowerCase().includes(searchLower) ||
          item?.duongdan?.toLowerCase().includes(searchLower) ||
          item?.tuongtac?.toLowerCase().includes(searchLower) ||
          item?.ngayphathien?.toLowerCase().includes(searchLower) ||
          item?.ngaybocgo?.toLowerCase().includes(searchLower) ||
          item?.nentang?.toString().includes(searchLower) ||
          item?.donvixuly?.toString().includes(searchLower) ||
          item?.trangthai?.toString().includes(searchLower),
      )
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  updateData(): void {
    this.totalData = this.dataDetail?.length;
    this.updatedData = this.dataDetail?.map((item: any, index: any) => ({
      ...item,
      index: index + 1,
      ngayphathien: item?.ngayphathien
        ? formatDatePosition(item?.ngayphathien)
        : '',
      ngaybocgo: item?.ngaybocgo ? formatDatePosition(item?.ngaybocgo) : '',
      tuongtac: item?.tuongtac ? formatNumberWithDot(item?.tuongtac) : 0,
    }));
    this.cdr.markForCheck();
  }

  constructor() {}

  onPageChange(page: number) {
    this.page === page;
  }

  ngOnInit(): void {
    console.log('thong tin boc go: ', this.dataDetail);
    this.pageSettings = {
      pageSize: 8,
      currentPage: 1,
      enablePageNumbers: true,
    };
    this.updateData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataDetail']) {
      const previousValue = changes['dataDetail'].previousValue;
      const currentValue = changes['dataDetail'].currentValue;

      if (previousValue !== currentValue) {
        // Handle the change here
        this.updateData(); // Call your updateData method to reflect the changes
      }
    }
  }
  // xử lý sự kiện đóng popup từ component con tới component cha
  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
}
