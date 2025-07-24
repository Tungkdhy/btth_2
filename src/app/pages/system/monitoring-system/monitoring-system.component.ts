import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MonitoringSystemModel,
  SearchMonitoringSystemModel,
} from '../../../modules/monitoring-system/models/monitoring-system.model';
import { ColumnHeadingModel } from '../../../core/models/form-utilities.model';
import { Constant } from '../../../core/config/constant';
import { MonitoringSystemService } from '../../../modules/monitoring-system/services/monitoring-system.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResultListPaginationModel } from '../../../core/models/api-response.model';
import { FormMonitoringSystemComponent } from '../../../modules/monitoring-system/components/form-monitoring-system/form-monitoring-system.component';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-delete-modal/confirm-delete-modal.component';
import { TableWidgetComponent } from '../../../shared/table-widget/table-widget.component';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-monitoring-system',
  standalone: true,
  imports: [CommonModule, TableWidgetComponent],
  templateUrl: './monitoring-system.component.html',
  styleUrls: ['./monitoring-system.component.scss'],
})
export class MonitoringSystemComponent implements OnInit {
  public dataList: MonitoringSystemModel[];
  public dataList$: Observable<MonitoringSystemModel[]>;
  public columnHeading: ColumnHeadingModel[] = [
    {
      code: 'name',
      name: 'Tên hệ thống',
    },
    {
      code: 'type',
      name: 'Loại hệ thống',
    },
  ];

  public search: SearchMonitoringSystemModel = {
    name: '',
    username: '',
    query: '',

    page: 1,
    size: Constant.PAGING.SIZE,
    length: 0,
    active: '',
    direction: Constant.DIRECTION.DESC,
    sortBy: '',

    previous: Constant.PAGING.PREVIOUS,
    next: Constant.PAGING.NEXT,
    maxSize: Constant.PAGING.MAX_SIZE,
    rotate: Constant.PAGING.ROTATE,
  };

  // Flag check loading
  public isDataLoading: Promise<boolean> = Promise.resolve(false);

  private monitoringService: MonitoringSystemService = inject(
    MonitoringSystemService,
  );
  private toast: ToastrService = inject(ToastrService);
  private ngbModal: NgbModal = inject(NgbModal);
  constructor() {}

  ngOnInit(): void {
    this.handleReloadData();
  }

  private getPagingList(): Observable<MonitoringSystemModel[]> {
    return this.monitoringService.getPagingList(this.search).pipe(
      tap((result: ResultListPaginationModel<MonitoringSystemModel>) => {
        this.search.length = result.data.totalElements;
      }),
      map(
        (result: ResultListPaginationModel<MonitoringSystemModel>) =>
          result.data.content,
      ),
    );
  }

  // private getPagingList(): void {
  //   this.isDataLoading = Promise.resolve(true);
  //   this.monitoringService
  //     .getPagingList(this.search)
  //     .subscribe((res: ResultListPaginationModel<any>) => {
  //       this.dataList = res.data.content;
  //       this.search.length = res.data.totalElements;
  //       this.isDataLoading = Promise.resolve(false);
  //     });
  // }

  private deleteRecord(selectedId: string): void {
    this.monitoringService.delete(selectedId).subscribe(() => {
      this.toast.success('Xóa thành công');
      setTimeout(() => this.handleReloadData(), 150);
    });
  }

  handleAdd() {
    const addModal = this.ngbModal.open(FormMonitoringSystemComponent, {
      size: 'xl',
    });

    addModal.componentInstance.reloadData.subscribe(() =>
      setTimeout(() => {
        this.handleReloadData();
      }, 100),
    );
  }

  handleDelete(data: string) {
    const modalRef = this.ngbModal.open(ConfirmDeleteModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.data = data;
    modalRef.result.then(
      () => this.deleteRecord(data),
      () => {},
    );
  }

  handleEdit(data: string) {
    const editModal = this.ngbModal.open(FormMonitoringSystemComponent, {
      size: 'xl',
    });
    editModal.componentInstance.selectedId = data;
    editModal.componentInstance.reloadData.subscribe(() =>
      setTimeout(() => this.handleReloadData(), 100),
    );
  }

  public handleSearch(textSearch: string): void {
    this.search.query = textSearch;
    this.handleReloadData();
  }

  private handleReloadData(): void {
    this.dataList$ = this.getPagingList();
  }

  changePageSize(page: number) {
    this.search.page = page;
  }
}
