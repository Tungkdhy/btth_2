import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { interval, of, startWith, tap } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { MapSupabaseService } from '../../../modules/dashboard/services/map-supabase.service';
import {
  loadSecurityAlerts,
  loadSecurityAlertsSuccess,
} from './alert-security.actions';
import { Store } from '@ngrx/store';
import { selectDateV2 } from '../../date-time-range-v2/date-time-range-v2.selectors';
import { formatDateForElasticsearch } from '../../../_metronic/layout/core/common/common-utils';
import { formatDate } from '@angular/common';
import {Constant} from "../../../core/config/constant";

@Injectable()
export class AlertSecurityEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private networkService = inject(MapSupabaseService);

  loadAlerts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSecurityAlerts),
      switchMap(() =>
        interval(Constant.TIMER.ALERT_INTERVAL).pipe(
          startWith(0),
          switchMap(() => {
            return this.store.select(selectDateV2).pipe(
              filter((date) => !!(date && date.startDate && date.endDate)),
              switchMap((date) =>
                this.networkService
                  .getInfoSecAlertList({
                    limit: 99999,
                    from: formatDate(
                      date.startDate!,
                      'yyyy-MM-dd HH:mm:ss',
                      'en-US',
                    ),
                    to: formatDate(date.endDate!, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
                  })
                  .pipe(
                    map((alerts) => loadSecurityAlertsSuccess({ alerts })),
                    catchError(() =>
                      of({ type: '[Alert Security] Load Alerts Failure' }),
                    ),
                  ),
              ),
            );
          }),
        )
      )
    )
    // return interval(30000).pipe(
    //   // Lấy fromDate và toDate từ store
    //   startWith(0),
    //   switchMap(() => {
    //     return this.store.select(selectDateV2).pipe(
    //       filter((date) => !!(date && date.startDate && date.endDate)),
    //       switchMap((date) =>
    //         this.networkService
    //           .getInfoSecAlertList({
    //             limit: 99999,
    //             from: formatDate(
    //               date.startDate!,
    //               'yyyy-MM-dd HH:mm:ss',
    //               'en-US',
    //             ),
    //             to: formatDate(date.endDate!, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
    //           })
    //           .pipe(
    //             map((alerts) => loadSecurityAlertsSuccess({ alerts })),
    //             catchError(() =>
    //               of({ type: '[Alert Security] Load Alerts Failure' }),
    //             ),
    //           ),
    //       ),
    //     );
    //   }),
    // );

  });
}
