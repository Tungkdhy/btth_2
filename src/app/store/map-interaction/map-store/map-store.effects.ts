import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as MapActions from './map-store.actions';
import {
  loadAccessDataByBoundaryIdAndLevel,
  loadBoundaryData,
  loadCoreData,
} from './map-store.actions';
import { catchError, filter, map, mergeMap, startWith } from 'rxjs/operators';
import { interval, of, switchMap, takeUntil, tap } from 'rxjs';
import { StatsApiFilters } from '../device-stats/device-stats.models';
import {
  CoreCode,
  MainType,
  UnitPath,
} from '../../../modules/dashboard/models/btth.interface';
import {
  selectAccessLayersMapByBoundaryCodeAndLevel,
  selectBoundaryLayersMap,
} from '../network-system/network-system.selectors';
import { MapSupabaseService } from '../../../modules/dashboard/services/map-supabase.service';
import { selectMapApiFilters } from './map-store.selectors';
import { MapApiFilters } from './map-store.model';
import { selectDateV2 } from '../../date-time-range-v2/date-time-range-v2.selectors';

@Injectable()
export class MapStoreEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private supabaseService = inject(MapSupabaseService);

  private filterDuplicates(arr: string[]): string[] {
    return Array.from(new Set(arr));
  }

  loadDeviceData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapActions.loadDeviceData),
      mergeMap((action) =>
        this.supabaseService.getMapDeviceCount(action.filters).pipe(
          map((data) =>
            MapActions.loadDeviceDataSuccess({ data: data.formattedData }),
          ),
          catchError((error) =>
            of(MapActions.loadDeviceDataFailure({ error })),
          ),
        ),
      ),
    );
  });

  // Tải dữ liệu cho security
  loadSecurityData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapActions.loadSecurityData),
      switchMap((action) =>
        this.supabaseService.getMapAlertCount(action.filters).pipe(
          map((data) =>
            MapActions.loadSecurityDataSuccess({ data: data.formattedData }),
          ),
          catchError((error) =>
            of(MapActions.loadSecurityDataFailure({ error })),
          ),
        ),
      ),
    );
  });

  // updateFiltersEffect$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     // Lắng nghe khi action updateFilters được dispatch
  //     ofType(MapActions.updateMapFilters),
  //     // mergeMap để dispatch nhiều action cùng lúc
  //     mergeMap((action) => {
  //       const filters = action.filters;
  //       return [
  //         MapActions.updateDeviceStatsFilters({ filters }),
  //         MapActions.updateEndpointStatsFilters({ filters }),
  //         SecurityStatsActions.updateSecurityStatsFilters({ filters }),
  //       ];
  //     }),
  //   );
  // });

  refreshMap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapActions.refreshMap),
      switchMap(() =>
        this.store.select(selectDateV2).pipe(
          // Lấy fromDate và toDate từ store
          filter((date) => !!(date && date.startDate && date.endDate)),
          switchMap((date) =>
            interval(30000).pipe(
              startWith(0),
              takeUntil(this.actions$.pipe(ofType(MapActions.stopRefreshMap))), // Stop the interval when stopRefreshMap is dispatched
              switchMap(() =>
                this.store.select(selectMapApiFilters).pipe(
                  // Lấy các filters khác từ store
                  mergeMap((filters) => {
                    const apiFilters: MapApiFilters = {
                      ...filters,
                      fromDate: date?.startDate || null,
                      toDate: date?.endDate || null,
                    };
                    // console.log(apiFilters);
                    return [
                      MapActions.loadDeviceData({ filters: apiFilters }),
                      MapActions.loadSecurityData({ filters: apiFilters }),
                    ];
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  });

  loadCoreStatsEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCoreData),
      // mergeMap để dispatch nhiều action cùng lúc
      switchMap(() => {
        const filters: Partial<StatsApiFilters> = {
          mainType: MainType.MILITARY,
          subTypeList: [UnitPath.QS_QP],
          core: null,
          boundary: null,
          coreList: [CoreCode.A40, CoreCode.A91, CoreCode.A99],
          boundaryList: [],
          isFetchCore: true,
          isFetchBoundary: false,
        };

        return of(MapActions.updateMapFilters({ filters }));
      }),
    );
  });

  // selectBoundaryLayersMap
  loadBoundaryStatsEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBoundaryData),
      switchMap((action) =>
        this.store.select(selectBoundaryLayersMap(action.coreLayerName)).pipe(
          switchMap((boundaryLayers) => {
            let boundaryList = [];
            for (let boundary of boundaryLayers.values()) {
              boundaryList.push(boundary.abbr);
            }
            const filters: Partial<StatsApiFilters> = {
              mainType: MainType.MILITARY,
              subTypeList: [UnitPath.QS_QP],
              boundaryList,
              isFetchCore: false,
              isFetchBoundary: true,
            };
            return of(MapActions.updateMapFilters({ filters }));
          }),
        ),
      ),
    );
  });

  loadAccessStatsByBoundaryIdAndLevelEffect$ = createEffect(() => {
    return this.actions$.pipe(
      // Lắng nghe khi action updateFilters được dispatch
      ofType(loadAccessDataByBoundaryIdAndLevel),
      // mergeMap để dispatch nhiều action cùng lúc
      switchMap((action) =>
        this.store
          .select(
            selectAccessLayersMapByBoundaryCodeAndLevel(
              action.level,
              action.boundaryLayerName,
            ),
          )
          .pipe(
            switchMap((accessLayers) => {
              let boundaryList = [];
              let accessList = [];
              for (let access of accessLayers.values()) {
                boundaryList.push(access.boundaryName);
                accessList.push(access.path);
              }
              const filters: Partial<StatsApiFilters> = {
                mainType: MainType.MILITARY,
                subTypeList: accessList,
                boundaryList: this.filterDuplicates(boundaryList),
                isFetchCore: false,
                isFetchBoundary: false,
              };
              return of(MapActions.updateMapFilters({ filters }));
            }),
          ),
      ),
    );
  });
}
