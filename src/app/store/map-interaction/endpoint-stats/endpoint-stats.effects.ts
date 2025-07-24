import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MapSupabaseService } from '../../../modules/dashboard/services/map-supabase.service';
import { Store } from '@ngrx/store';
import * as EndpointStatsActions from './endpoint-stats.actions';
import {
  catchError,
  map,
  mergeMap,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { interval, of, takeUntil } from 'rxjs';
import { selectEndpointStatsApiFilters } from './endpoint-stats.selectors';

@Injectable()
export class EndpointStatsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private deviceService = inject(MapSupabaseService);

  loadEndpointStats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EndpointStatsActions.loadEndpointStats),
      mergeMap((action) =>
        this.deviceService.getMapEndpointCount(action.filters).pipe(
          map((data) =>
            EndpointStatsActions.loadEndpointStatsSuccess({ data }),
          ),
          catchError((error) =>
            of(EndpointStatsActions.loadEndpointStatsFailure({ error })),
          ),
        ),
      ),
    );
  });

  refreshEndpointStats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EndpointStatsActions.refreshEndpointStats),
      switchMap(() =>
        this.store.select(selectEndpointStatsApiFilters).pipe(
          switchMap((filters) =>
            interval(30000).pipe(
              startWith(0),
              takeUntil(
                this.actions$.pipe(
                  ofType(EndpointStatsActions.stopRefreshEndpointStats),
                ),
              ),
              switchMap(() =>
                this.deviceService.getMapEndpointCount(filters).pipe(
                  map((data) =>
                    EndpointStatsActions.loadEndpointStatsSuccess({ data }),
                  ),
                  catchError((error) =>
                    of(
                      EndpointStatsActions.loadEndpointStatsFailure({
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
    );
  });
}
