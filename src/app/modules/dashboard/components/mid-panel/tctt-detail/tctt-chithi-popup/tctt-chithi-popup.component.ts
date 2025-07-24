import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  inject,
  ChangeDetectorRef,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {
  GridModule,
  EditService,
  ToolbarService,
  PageService,
} from '@syncfusion/ej2-angular-grids';
import {
  formatDatePosition,
  formatNumberWithDot,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { BreadcrumLeftRightComponent } from "../../../shared/breadcrum-left-right/breadcrum-left-right.component";

@Component({
  selector: 'app-tctt-chithi-popup',
  templateUrl: './tctt-chithi-popup.component.html',
  styleUrls: ['./tctt-chithi-popup.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, GridModule, NgbPaginationModule, BreadcrumLeftRightComponent],
  providers: [EditService, ToolbarService, PageService],
  encapsulation: ViewEncapsulation.None,
})
export class TcttChithiPopupComponent implements OnInit {
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
      .filter(
        (item) =>
          item?.noidung_vipham?.toLowerCase().includes(searchLower) ||
          item?.duongdan?.toLowerCase().includes(searchLower) ||
          item?.tuongtac?.toLowerCase().includes(searchLower) ||
          item?.ngayphathien?.toLowerCase().includes(searchLower) ||
          item?.nentang?.toLowerCase().includes(searchLower) ||
          item?.trangthai?.toString().includes(searchLower),
      )
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  updateData(): void {
    this.totalData = this.dataDetail.length;
    this.updatedData = this.dataDetail
      ?.map((item: any, index: any) => ({
        ...item,
        index: index + 1,
        ngayphathien: formatDatePosition(item.ngayphathien),
        tuongtac: formatNumberWithDot(item.tuongtac),
      }))
      .sort((a: any, b: any) => {
        const dateA = new Date(a.ngayphathien.split('-').reverse().join('-')); // Convert "DD-MM-YYYY" to "YYYY-MM-DD"
        const dateB = new Date(b.ngayphathien.split('-').reverse().join('-'));

        return dateB.getTime() - dateA.getTime(); // Sort descending by ngayphathien
      });
    this.cdr.markForCheck();
  }

  constructor() {}

  onPageChange(page: number) {
    this.page === page;
  }

  ngOnInit(): void {
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
        console.log('dataDetail changed:', currentValue);
        this.updateData(); // Call your updateData method to reflect the changes
      }
    }
  }
  // xử lý sự kiện đóng popup từ component con tới component cha
  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
}
