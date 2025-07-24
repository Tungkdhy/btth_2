import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import * as StatisticsActions from './statistics-store.actions';
import * as DeviceStatsActions from '../device-stats/device-stats.actions';
import * as EndpointStatsActions from '../endpoint-stats/endpoint-stats.actions';
import * as SecurityStatsActions from '../security-stats/security-stats.actions';
import { StatsApiFilters } from '../device-stats/device-stats.models';
import {
  CoreCode,
  MainType,
  UnitPath,
} from '../../../modules/dashboard/models/btth.interface';
import { of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectAccessLayersMapByBoundaryCodeAndLevel,
  selectAccessLayersMapByUnitPathAndOneLevelDeeper,
  selectBoundaryLayersMap,
  selectNearestAccessLayersByBoundaryCode,
} from '../network-system/network-system.selectors';
import { defaultFilters } from '../map-interaction-utils';

@Injectable()
export class StatisticsStoreEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  private filterDuplicates(arr: string[]): string[] {
    return Array.from(new Set(arr));
  }

  refreshEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StatisticsActions.refreshStatistics),
      mergeMap(() => {
        return [
          DeviceStatsActions.refreshDeviceStats(),
          EndpointStatsActions.refreshEndpointStats(),
          SecurityStatsActions.refreshSecurityStats(),
        ];
      }),
    );
  });

  stopRefreshEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StatisticsActions.stopRefreshStatistics),
      mergeMap(() => {
        return [
          DeviceStatsActions.stopRefreshDeviceStats(),
          EndpointStatsActions.stopRefreshEndpointStats(),
          SecurityStatsActions.stopRefreshSecurityStats(),
        ];
      }),
    );
  });

  // Effect lắng nghe action updateFilters và dispatch nhiều action khác
  updateFiltersEffect$ = createEffect(() => {
    return this.actions$.pipe(
      // Lắng nghe khi action updateFilters được dispatch
      ofType(StatisticsActions.updateFilters),
      // mergeMap để dispatch nhiều action cùng lúc
      mergeMap((action) => {
        const filters = action.filters;
        return [
          DeviceStatsActions.updateDeviceStatsFilters({ filters }),
          EndpointStatsActions.updateEndpointStatsFilters({ filters }),
          SecurityStatsActions.updateSecurityStatsFilters({ filters }),
        ];
      }),
    );
  });

  // Effect lắng nghe action updateFilters và dispatch nhiều action khác
  updateDefaultFiltersEffect$ = createEffect(() => {
    return this.actions$.pipe(
      // Lắng nghe khi action updateFilters được dispatch
      ofType(StatisticsActions.updateDefaultFilters),
      // mergeMap để dispatch nhiều action cùng lúc
      mergeMap(() => {
        const filters = defaultFilters;
        return [
          DeviceStatsActions.updateDeviceStatsFilters({ filters }),
          EndpointStatsActions.updateEndpointStatsFilters({ filters }),
          SecurityStatsActions.updateSecurityStatsFilters({ filters }),
        ];
      }),
    );
  });

  loadCoreStatsEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StatisticsActions.loadCoreStats),
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

        return of(StatisticsActions.updateFilters({ filters }));
      }),
    );
  });

  loadBoundaryStatsEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StatisticsActions.loadBoundaryStats),
      switchMap((action) =>
        this.store.select(selectBoundaryLayersMap(action.coreLayerCode)).pipe(
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
            return of(StatisticsActions.updateFilters({ filters }));
          }),
        ),
      ),
    );
  });

  loadAccessStatsByBoundaryCodeEffect$ = createEffect(() => {
    return this.actions$.pipe(
      // Lắng nghe khi action updateFilters được dispatch
      ofType(StatisticsActions.loadAccessStatsByBoundaryCode),
      // mergeMap để dispatch nhiều action cùng lúc
      switchMap((action) =>
        this.store
          .select(selectNearestAccessLayersByBoundaryCode(action.boundaryCode))
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
              return of(StatisticsActions.updateFilters({ filters }));
            }),
          ),
      ),
    );
  });

  loadAccessStatsByBoundaryCodeAndLevelEffect$ = createEffect(() => {
    return this.actions$.pipe(
      // Lắng nghe khi action updateFilters được dispatch
      ofType(StatisticsActions.loadAccessStatsByBoundaryCodeAndLevel),
      // mergeMap để dispatch nhiều action cùng lúc
      switchMap((action) =>
        this.store
          .select(
            selectAccessLayersMapByBoundaryCodeAndLevel(
              action.level,
              action.boundaryCode,
              action.unitPath,
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
              return of(StatisticsActions.updateFilters({ filters }));
            }),
          ),
      ),
    );
  });

  loadAccessStatsByUnitPathEffect$ = createEffect(() => {
    return this.actions$.pipe(
      // Lắng nghe action loadAccessStatsByUnitPath
      ofType(StatisticsActions.loadAccessStatsByUnitPath),
      // Xử lý action với unitPath từ props
      switchMap((action) =>
        this.store
          .select(
            selectAccessLayersMapByUnitPathAndOneLevelDeeper(action.unitPath),
          )
          .pipe(
            switchMap((accessLayers) => {
              let boundaryList: string[] = [];
              let accessList: string[] = [];

              // Duyệt qua map accessLayers và lấy thông tin boundary và access path
              for (let access of accessLayers.values()) {
                if (
                  (!action.boundaryCode ||
                    access.boundaryName === action.boundaryCode) &&
                  (!action.coreCode || access.coreName === action.coreCode)
                ) {
                  boundaryList.push(access.boundaryName);
                  accessList.push(access.path);
                }
              }

              const filters: Partial<StatsApiFilters> = {
                mainType: MainType.MILITARY,
                subTypeList: accessList,
                boundaryList: this.filterDuplicates(boundaryList),
                isFetchCore: false,
                isFetchBoundary: false,
              };

              // Dispatch action updateFilters với dữ liệu mới
              return of(StatisticsActions.updateFilters({ filters }));
            }),
          ),
      ),
    );
  });
}
