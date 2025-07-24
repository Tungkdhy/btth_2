import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { interval, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { utils, writeFileXLSX } from 'xlsx';
import { formatDateTime } from '../../_metronic/layout/core/common/common-utils';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Constant } from '../config/constant';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toast: ToastrService = inject(ToastrService);
  private config: ConfigService = inject(ConfigService);

  goTopology(unitId: string): Promise<boolean> {
    return this.router.navigate(['ban-do', 'ban-do-cau-truc-mang'], {
      queryParams: { id: unitId },
    });
  }

  getUnitIdFromQueryParam(): Observable<string> {
    return this.route.queryParams.pipe(
      map((params: Params) => params.id),
      filter((id: string) => !!id),
      distinctUntilChanged(),
    );
  }

  getIdWithInterval<T>(): Observable<string> {
    const id$ = this.getUnitIdFromQueryParam();
    const interval$ = interval(30000).pipe(startWith(0));
    return id$.pipe(switchMap((id) => interval$.pipe(map(() => id))));
  }

  updateQueryParams(unitId: string): Promise<boolean> {
    return this.router.navigate([], {
      queryParams: { id: unitId },
    });
  }

  exportExcel(dataList: any[]): Observable<any[]> {
    if (!dataList || dataList.length === 0) {
      this.toast.error('Không có dữ liệu để xuất');
      return of([]);
    }
    return of(dataList).pipe(
      tap((data: any[]) => {
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Data');

        const today = new Date();
        const fileName = 'DataGrid_' + formatDateTime(today);

        writeFileXLSX(wb, fileName + '.xlsx');
      }),
    );
  }

  getUnitIconById(iconId: string | null | undefined): string {
    return iconId
      ? this.config.getBackendApi() +
          Constant.URLS.ATTACHMENTS.GET_IMAGE_BY_ID(iconId)
      : '';
  }

  navigateBack(nodes: number, route: ActivatedRoute) {
    const path = '../'.repeat(nodes);
    this.router.navigate([path], { relativeTo: route }).then();
  }

  navigateToSpecificParent(path: string) {
    this.router.navigate(path.split('/')).then();
  }
}
