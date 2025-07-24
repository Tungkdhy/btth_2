import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MapSupabaseService } from '../../../modules/dashboard/services/map-supabase.service';
import { Store } from '@ngrx/store';
import * as DeviceStatsActions from './device-stats.actions';
import {
  catchError,
  map,
  mergeMap,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { interval, of, takeUntil } from 'rxjs';
import { StatsApiFilters } from './device-stats.models';
import * as NetworkInfrastructureActions from '../../network-infrastructure/network-infrastructure.actions';
import { selectNetworkInfrastructureApiFilters } from '../../network-infrastructure/network-infrastructure.selectors';
import { selectDeviceStatsApiFilters } from './device-stats.selectors';
import * as EndpointStatsActions from '../endpoint-stats/endpoint-stats.actions';

@Injectable()
export class DeviceStatsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private deviceService = inject(MapSupabaseService);

  loadDeviceStats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DeviceStatsActions.loadDeviceStats),
      mergeMap((action) =>
        this.deviceService.getMapDeviceCount(action.filters).pipe(
          map((data) => DeviceStatsActions.loadDeviceStatsSuccess({ data })),
          catchError((error) =>
            of(DeviceStatsActions.loadDeviceStatsFailure({ error })),
          ),
        ),
      ),
    );
  });

  refreshDeviceStats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DeviceStatsActions.refreshDeviceStats),
      switchMap(() =>
        this.store.select(selectDeviceStatsApiFilters).pipe(
          switchMap((filters) =>
            interval(30000).pipe(
              startWith(0),
              takeUntil(
                this.actions$.pipe(
                  ofType(DeviceStatsActions.stopRefreshDeviceStats),
                ),
              ),
              switchMap(() =>
                this.deviceService.getMapDeviceCount(filters).pipe(
                  map((data) =>
                    DeviceStatsActions.loadDeviceStatsSuccess({ data }),
                  ),
                  catchError((error) =>
                    of(DeviceStatsActions.loadDeviceStatsFailure({ error })),
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
