import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tctt-popup-tuongquanbaiviet',
  templateUrl: './tctt-popup-tuongquanbaiviet.component.html',
  styleUrls: ['./tctt-popup-tuongquanbaiviet.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPagination],
})
export class TcttPopupTuongquanbaivietComponent {
  @Input() dataDetail: any[] = [];

  public pageSettings = {};
  searchTarget: string = '';
  searchUnit: string = '';
  searchType: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  get filteredData(): any {
    return this.dataDetail
      .filter(
        (item) =>
          item?.target &&
          item.target.toLowerCase().includes(this.searchTarget.toLowerCase()) &&
          item?.unit &&
          item.unit.toLowerCase().includes(this.searchUnit.toLowerCase()) &&
          item?.type &&
          item.type.toLowerCase().includes(this.searchType.toLowerCase()),
      )
      .slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage,
      );
  }

  get totalPages(): number {
    return Math.ceil(this.dataDetail.length / this.itemsPerPage);
  }

  filterTable() {
    this.currentPage = 1;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.pageSettings = {
      pageSize: 8,
      currentPage: 1,
      enablePageNumbers: true,
    };
    console.log('tuong quan detail');
  }

  // xử lý sự kiện đóng popup từ component con tới component cha
  total: number = 20;
  page: number = 1;
  pageSize: number = 5;
  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }

  onPageChange($event: number) {}
}
