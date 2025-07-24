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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbModal,
  NgbPagination,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  GridModule,
  EditService,
  ToolbarService,
  PageService,
  FilterService,
  GridComponent,
} from '@syncfusion/ej2-angular-grids';
import { debounceTime, filter, Observable, Subject, tap } from 'rxjs';
import { ProtectingTargetModalComponent } from '../../../shared/protecting-target-modal/protecting-target-modal.component';
import {
  formatDateTime,
  getDateRangePayload,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { Store } from '@ngrx/store';
import { selectDateV2 } from 'src/app/store/date-time-range-v2/date-time-range-v2.selectors';
import { BreadcrumLeftRightComponent } from "../../../shared/breadcrum-left-right/breadcrum-left-right.component";
@Component({
  selector: 'app-tctt-popup',
  templateUrl: './tctt-popup.component.html',
  styleUrls: ['./tctt-popup.component.scss'],
  standalone: true,
  // imports: [CommonModule, FormsModule, NgbPagination],
  imports: [CommonModule, FormsModule, GridModule, NgbPaginationModule, BreadcrumLeftRightComponent],
  providers: [EditService, ToolbarService, PageService],
})
export class TcttPopupComponent implements OnInit {
  @Input() dataDetail: any;
  @Input() startDate: string;
  @Input() endDate: string;

  public updatedData: any[] = [];

  public pageSettings = {};
  private cdr = inject(ChangeDetectorRef);
  private modal = inject(NgbModal);
  public selectedStart: string | Date;
  public selectedEnd: string | Date;

  public searchText: string = '';
  page: number = 1;
  pageSize: number = 10;

  date$: Observable<any>;

  @ViewChild('grid') public grid: GridComponent;
  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  constructor(private store: Store) {}

  get filteredData(): any {
    const searchLower = this.searchText.toString().toLowerCase();
    return this.updatedData
      .filter(
        (item) =>
          item?.name?.toString().toLowerCase().includes(searchLower) ||
          item?.chucvu?.toString().toLowerCase().includes(searchLower) ||
          item?.quequan?.toString().toLowerCase().includes(searchLower),
      )
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  updateData(): void {
    this.updatedData = this.dataDetail?.data?.map((item: any, index: any) => ({
      ...item,
      index: index + 1,
    }));
    this.cdr.markForCheck();
  }

  onPageChange(page: number) {
    this.page === page;
  }

  ngOnInit(): void {
    this.date$ = this.store.select(selectDateV2).pipe(
      filter((date) => !!(date && date.startDate && date.endDate)),
      tap((date) => {
        // DO sth
        const { startDate, endDate } = getDateRangePayload(
          date.startDate!,
          date.endDate!,
          '1',
        );
        this.selectedStart = startDate;
        this.selectedEnd = endDate;
      }),
    );
    this.updateData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataDetail']) {
      const previousValue = changes['dataDetail'].previousValue;
      const currentValue = changes['dataDetail'].currentValue;

      if (previousValue?.data !== currentValue?.data) {
        this.updateData();
        // You can handle any logic you want here when dataDetail.data changes
      }
    }
  }

  // xử lý sự kiện đóng popup từ component con tới component cha
  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }

  openProtectingTargetModal(id: string): void {
    let infoModal = this.modal.open(ProtectingTargetModalComponent, {
      modalDialogClass: 'dialogClass',
      centered: true,
    });
    // TODO: Pass data to child
    // infoModal.componentInstance.serial_number = serial_number;
    infoModal.componentInstance.id = id;
    infoModal.componentInstance.selectedStartDate = this.selectedStart;
    infoModal.componentInstance.selectedEndDate = this.selectedEnd;
  }
}
