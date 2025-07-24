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
import { debounceTime, Subject } from 'rxjs';
import { formatNumberWithDot } from 'src/app/_metronic/layout/core/common/common-utils';
import { BreadcrumLeftRightComponent } from "../../../shared/breadcrum-left-right/breadcrum-left-right.component";

@Component({
  selector: 'app-tctt-truyenthong-popup',
  templateUrl: './tctt-truyenthong-popup.component.html',
  styleUrls: ['./tctt-truyenthong-popup.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, GridModule, NgbPaginationModule, BreadcrumLeftRightComponent],
  providers: [EditService, ToolbarService, PageService],
  encapsulation: ViewEncapsulation.None,
})
export class TcttTruyenthongPopupComponent implements OnInit {
  @Input() dataDetail: any[] = [];
  public updatedData: any[] = [];
  public searchText: string = '';

  private cdr = inject(ChangeDetectorRef);
  private searchSubject: Subject<string> = new Subject();

  page: number = 1;
  pageSize: number = 10;

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  get filteredData(): any {
    const searchLower = this.searchText.toLowerCase();
    return this.updatedData
      .filter(
        (item) =>
          item?.name?.toLowerCase().includes(searchLower) ||
          item?.trangthai?.toLowerCase().includes(searchLower) ||
          item?.nentang?.toLowerCase().includes(searchLower) ||
          item?.donvi?.toLowerCase().includes(searchLower) ||
          item?.duongdan?.toLowerCase().includes(searchLower) ||
          item?.theodoi?.toString().includes(searchLower) ||
          item?.tuongtac?.toString().includes(searchLower),
      )
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  updateData(): void {
    this.updatedData = this.dataDetail?.map((item: any, index: any) => ({
      ...item,
      index: index + 1,
      theodoi: item?.theodoi ? formatNumberWithDot(item?.theodoi) : 0,
      tuongtac: item?.tuongtac ? formatNumberWithDot(item?.tuongtac) : 0,
    }));
    this.cdr.markForCheck();
  }

  constructor() {}

  ngOnInit(): void {
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

  onPageChange(page: number) {
    this.page === page;
  }

  // xử lý sự kiện đóng popup từ component con tới component cha
  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
}
