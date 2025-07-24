import { CommonModule } from '@angular/common';
import { Component, OnInit,ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
@Component({
  selector: 'app-truc',
  templateUrl: './truc.component.html',
  styleUrls: ['./truc.component.scss'],
  standalone: true,
  imports: [CommonModule,CustomTableComponent],
})
export class TrucComponent implements OnInit,OnDestroy {
  currentDateTime: Date = new Date();
  intervalId: any;
  lichtruc:any[] = [
    {
      'Mô tả':"Trực CH",
      'Chức vụ':"PCHT.TMT",
      'Cấp bậc':"2//",
      "Tên":"Nguyễn Văn Mạnh"
    },
    {
      'Mô tả':"Trực ban trưởng",
      'Chức vụ':"CNTS",
      'Cấp bậc':"3/",
      "Tên":"Đào Thanh Tùng"
    },
    {
      'Mô tả':"Trực ban phó",
      'Chức vụ':"SQTCM",
      'Cấp bậc':"2/",
      "Tên":"Đào Lê Tùng"
    },
    {
      'Mô tả':"Trực ban nội vụ",
      'Chức vụ':"NVTCTT",
      'Cấp bậc':"2/CN",
      "Tên":"Nguyễn Văn Hoàng"
    }
  ]
  constructor(private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
    this.startRealTimeClock();
  }
  startRealTimeClock(): void {
    this.intervalId = setInterval(() => {
      this.currentDateTime = new Date();
      this.cdr.detectChanges();
    }, 1000); // Cập nhật mỗi 1 giây
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
