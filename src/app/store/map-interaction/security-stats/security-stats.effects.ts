import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MapSupabaseService } from '../../../modules/dashboard/services/map-supabase.service';
import { Store } from '@ngrx/store';
import * as SecurityStatsActions from './security-stats.actions';
import {
  catchError,
  filter,
  map,
  mergeMap,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { interval, of, takeUntil } from 'rxjs';
import { selectSecurityStatsApiFilters } from './security-stats.selectors';
import { selectDateV2 } from '../../date-time-range-v2/date-time-range-v2.selectors';

@Injectable()
export class SecurityStatsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private deviceService = inject(MapSupabaseService);

  loadSecurityStats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SecurityStatsActions.loadSecurityStats),
      mergeMap((action) =>
        this.deviceService.getMapAlertCount(action.filters).pipe(
          map((data) =>
            SecurityStatsActions.loadSecurityStatsSuccess({ data }),
          ),
          catchError((error) =>
            of(SecurityStatsActions.loadSecurityStatsFailure({ error })),
          ),
        ),
      ),
    );
  });
  //
  // private mapSecurityCountFnc(action: {
  //   filters: Partial<StatsApiFilters>;
  // }) {
  //   return this.deviceService
  //     .getMapAlertCount(
  //       action.filters,
  //       action.filters.isFetchCore,
  //       action.filters.isFetchBoundary,
  //     )
  //     .pipe(
  //       map((data) => SecurityStatsActions.loadSecurityStatsSuccess({ data })),
  //       catchError((error) =>
  //         of(SecurityStatsActions.loadSecurityStatsFailure({ error })),
  //       ),
  //     );
  // }

  refreshSecurityStats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SecurityStatsActions.refreshSecurityStats),
      switchMap(() =>
        this.store.select(selectDateV2).pipe(
          // Lấy fromDate và toDate từ store
          filter((date) => !!(date && date.startDate && date.endDate)),
          switchMap((date) =>
            interval(30000).pipe(
              startWith(0),
              takeUntil(
                this.actions$.pipe(
                  ofType(SecurityStatsActions.stopRefreshSecurityStats),
                ),
              ),
              switchMap(() =>
                this.store.select(selectSecurityStatsApiFilters).pipe(
                  // Lấy các filters khác từ store
                  switchMap((filters) =>
                    this.deviceService
                      .getMapAlertCount({
                        ...filters,
                        fromDate: date?.startDate,
                        toDate: date?.endDate,
                      })
                      .pipe(
                        map((data) =>
                          SecurityStatsActions.loadSecurityStatsSuccess({
                            data,
                          }),
                        ),
                        catchError((error) =>
                          of(
                            SecurityStatsActions.loadSecurityStatsFailure({
                              error,
                            }),
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
  //   return this.store.select(selectDate).pipe( // Lấy fromDate và toDate từ store
  //     switchMap(({ fromDate, toDate }) =>
  //       this.store.select(selectSecurityEventFilters).pipe( // Lấy các filters khác từ store
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
  //                   filters.warningLevel,
  //                   fromDate,  // Sử dụng fromDate từ store
  //                   toDate     // Sử dụng toDate từ store
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
  //                 )
  //             )
  //           )
  //         )
  //       )
  //     )
  //   );
  // });
}
