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
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {
  GridModule,
  EditService,
  ToolbarService,
  PageService,
  FilterService,
  GridComponent,
} from '@syncfusion/ej2-angular-grids';
import { debounceTime, Subject } from 'rxjs';
import { BreadcrumLeftRightComponent } from "../../../shared/breadcrum-left-right/breadcrum-left-right.component";
@Component({
  selector: 'app-tctt-popup-tuongquanmuctieu',
  templateUrl: './tctt-popup-tuongquanmuctieu.component.html',
  styleUrls: ['./tctt-popup-tuongquanmuctieu.component.scss'],
  standalone: true,
  // imports: [CommonModule, FormsModule, NgbPagination],
  imports: [CommonModule, FormsModule, GridModule, NgbPaginationModule, BreadcrumLeftRightComponent],
  providers: [EditService, ToolbarService, PageService],
  encapsulation: ViewEncapsulation.None,
})
export class TcttPopupTuongquanmuctieuComponent {
  public searchText: string = '';
  page: number = 1;
  pageSize: number = 10;

  public updatedData: any[] = [];

  private cdr = inject(ChangeDetectorRef);

  @Input() dataDetail: any[] = [];

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  get filteredData(): any {
    const searchLower = this.searchText.toLowerCase();
    console.log(searchLower);
    return this.updatedData
      .filter(
        (item) =>
          item?.ten?.toLowerCase().includes(searchLower) ||
          item?.trangthai?.toLowerCase().includes(searchLower) ||
          item?.nentang?.toLowerCase().includes(searchLower),
      )
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  updateData(): void {
    this.updatedData = this.dataDetail?.map((item: any, index: any) => ({
      ...item,
      index: index + 1,
    }));
    this.cdr.markForCheck();
  }

  constructor() {}

  onPageChange(page: number) {
    this.page === page;
  }

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

  // xử lý sự kiện đóng popup từ component con tới component cha

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
}
