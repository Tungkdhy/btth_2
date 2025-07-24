import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';
import {
  DateRangePickerModule,
  RangeEventArgs,
} from '@syncfusion/ej2-angular-calendars';
import { utils, writeFileXLSX } from 'xlsx';
import {
  AsyncPipe,
  DatePipe,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchInfoSec } from '../../../../core/models/search';
// import { PartyCentralOfficeDto } from '../../../topology/models/party-central-office-alerts.model';
// import { PartyCentralOfficeAlertsService } from '../../../topology/services/party-central-office-alerts.service';
import { formatDate } from '../../../../_metronic/layout/core/common/common-utils';
import { ResultListPaginationModel } from '../../../../core/models/api-response.model';
// import { MainViewComputerComponent } from '../../../topology/components/main-view-computer/main-view-computer.component';

@Component({
  selector: 'app-violated-device-data-table-pco',
  templateUrl: './violated-device-data-table-pco.component.html',
  styles: [],
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    FormsModule,
    DateRangePickerModule,
    AsyncPipe,
    DatePipe,
    NgForOf,
    NgbPagination,
    NgSwitchDefault,
  ],
  standalone: true,
})
export class ViolatedDeviceDataTablePcoComponent implements OnInit {
  @Input() unitId: string;
  @Input() event: string = '';

  search = new SearchInfoSec();
  public startDate: Date;
  public endDate: Date;

  // deviceList$: Observable<PartyCentralOfficeDto[]>;
  public page = 1;
  public maxSize = 3;
  public pageSize = 10;

  constructor(
    // private pcoService: PartyCentralOfficeAlertsService,
    private modal: NgbModal,
  ) {
    // const date = getStorageDate();
    // if (date) {
    //   this.startDate = date.startDate ? new Date(date.startDate) : new Date();
    //   this.endDate = date.endDate ? new Date(date.endDate) : new Date();
    //   this.search.startDate = formatDate(this.startDate);
    //   this.search.endDate = formatDate(this.endDate);
    // }
  }

  ngOnInit(): void {
    // this.search.unitId = this.unitId;
    // this.search.category1 = this.event;
    // this.deviceList$ = this.getListByEvent(this.search);
  }
  //
  // getListByEvent(search: SearchInfoSec): Observable<PartyCentralOfficeDto[]> {
  //   return this.pcoService
  //     .search(search)
  //     .pipe(
  //       map(
  //         (response: ResultListPaginationModel<any>) =>
  //           response.data.content as unknown as PartyCentralOfficeDto[]
  //       )
  //     );
  // }
  //
  // changePage(currentPage: number) {
  //   this.search.page = currentPage;
  //   this.deviceList$ = this.getListByEvent(this.search);
  // }
  //
  // handleView(mac: string) {
  //   if (!mac) return;
  //   const modalView = this.modal.open(MainViewComputerComponent, {
  //     size: 'xl',
  //   });
  //   modalView.componentInstance.mac = mac;
  // }
  //
  // handleSearch() {
  //   this.deviceList$ = this.getListByEvent(this.search);
  // }
  //
  // onSelectDate(range: RangeEventArgs) {
  //   this.search.startDate = range.startDate ? formatDate(range.startDate) : '';
  //   this.search.endDate = range.endDate ? formatDate(range.endDate) : '';
  // }
  //
  // // formatDate(date: Date) {
  // //   let year = date.getFullYear();
  // //   let month = (1 + date.getMonth()).toString().padStart(2, '0');
  // //   let day = date.getDate().toString().padStart(2, '0');
  // //
  // //   return year + '-' + month + '-' + day;
  // // }
  //
  // exportExcel(devices: PartyCentralOfficeDto[]) {
  //   if (!devices) return;
  //   const ws = utils.json_to_sheet(devices);
  //   const wb = utils.book_new();
  //   utils.book_append_sheet(wb, ws, 'Data');
  //
  //   const today = new Date();
  //   const fileName = 'Event_' + this.event + '_' + formatDate(today);
  //
  //   writeFileXLSX(wb, fileName + '_' + '.xlsx');
  // }
}
