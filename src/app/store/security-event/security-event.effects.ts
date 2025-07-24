import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  startWith,
} from 'rxjs/operators';
import { of, interval, tap } from 'rxjs';
import * as SecurityEventActions from './security-event.actions';
import { Store } from '@ngrx/store';
import { MapSupabaseService } from '../../modules/dashboard/services/map-supabase.service';
import { selectSecurityEventApiFilters } from './security-event.selectors';
import { selectDate } from '../date-time-range/date-time-range.selectors';
import { formatDateTime } from '../../_metronic/layout/core/common/common-utils';

@Injectable()
export class SecurityEventEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private securityEventService = inject(MapSupabaseService);

  // Load Security Event Tree Count
  loadSecurityEventTreeCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SecurityEventActions.loadSecurityEventTreeCount),
      mergeMap((action) =>
        this.securityEventService
          .getSecurityEventTreeCount(
            action.mainType,
            action.subType,
            action.alertType,
            action.coreLayerName,
            action.boundaryLayerName,
            action.isAuto,
            action.warningLevel ?? undefined,
            action.fromDate ?? undefined,
            action.toDate ?? undefined,
          )
          .pipe(
            map((data) =>
              SecurityEventActions.loadSecurityEventTreeCountSuccess({ data }),
            ),
            catchError((error) =>
              of(
                SecurityEventActions.loadSecurityEventTreeCountFailure({
                  error,
                }),
              ),
            ),
          ),
      ),
    );
  });

  refreshSecurityEventTreeCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SecurityEventActions.refreshSecurityEventTreeCount), // Lắng nghe action refresh
      switchMap(() =>
        this.store.select(selectDate).pipe(
          // Lấy fromDate và toDate từ store
          switchMap((date) =>
            interval(30000).pipe(
              startWith(0),
              switchMap(() =>
                this.store.select(selectSecurityEventApiFilters).pipe(
                  // Lấy các filters khác từ store
                  switchMap((filters) =>
                    this.securityEventService
                      .getSecurityEventTreeCount(
                        filters.mainType,
                        filters.subType,
                        filters.alertType,
                        filters.coreLayerName,
                        filters.boundaryLayerName,
                        filters.isAuto,
                        filters.warningLevel ?? undefined,
                        formatDateTime(date?.startDate),
                        formatDateTime(date?.endDate),
                      )
                      .pipe(
                        map((data) =>
                          SecurityEventActions.loadSecurityEventTreeCountSuccess(
                            { data },
                          ),
                        ),
                        catchError((error) =>
                          of(
                            SecurityEventActions.loadSecurityEventTreeCountFailure(
                              { error },
                            ),
                          ),
                        ),
                      ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  });

  // refreshSecurityEventTreeCount$ = createEffect(() => {
  //   return this.store.select(selectDate).pipe(
  //     // Lấy fromDate và toDate từ store
  //     switchMap(({ startDate, endDate }) =>
  //       this.store.select(selectSecurityEventApiFilters).pipe(
  //         // Lấy các filters khác từ store
  //         switchMap((filters) =>
  //           interval(30000).pipe(
  //             startWith(0),
  //             switchMap(() =>
  //               this.securityEventService
  //                 .getSecurityEventTreeCount(
  //                   filters.mainType,
  //                   filters.subType,
  //                   filters.alertType,
  //                   filters.coreLayerName,
  //                   filters.boundaryLayerName,
  //                   filters.isAuto,
  //                   filters.warningLevel ?? undefined,
  //                   formatDateTime(startDate),
  //                   formatDateTime(endDate),
  //                 )
  //                 .pipe(
  //                   map((data) =>
  //                     SecurityEventActions.loadSecurityEventTreeCountSuccess({
  //                       data,
  //                     }),
  //                   ),
  //                   catchError((error) =>
  //                     of(
  //                       SecurityEventActions.loadSecurityEventTreeCountFailure({
  //                         error,
  //                       }),
  //                     ),
  //                   ),
  //                 ),
  //             ),
  //           ),
  //         ),
  //       ),
  //     ),
  //   );
  // });
}
