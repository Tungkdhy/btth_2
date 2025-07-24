import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import * as DutyActions from '../duty-schedule/duty-schedule.actions';
import * as BtthActions from '../unit-btth/unit-btth.actions';
import * as NetworkSystemActions from '../map-interaction/network-system/network-system.actions';
import * as MapStoreActions from '../map-interaction/map-store/map-store.actions';
import * as SecurityStatsActions from '../map-interaction/security-stats/security-stats.actions';
import * as DeviceStatsActions from '../map-interaction/device-stats/device-stats.actions';
import * as EndpointStatsActions from '../map-interaction/endpoint-stats/endpoint-stats.actions';
import * as CombinedStoreActions from '../combined-store/combined-store.actions';
import * as StatisticsStoreActions from '../map-interaction/statistics-store/statistics-store.actions';
import * as DateTimeRangeActionsV2 from '../date-time-range-v2/date-time-range-v2.actions';
import * as AlertDisconnectedActions from '../alert/alert-disconnected/alert-disconnected.actions';
import * as AlertSecurityActions from '../alert/alert-security/alert-security.actions';
import { loadAllData } from './component-loaded.actions';

@Injectable()
export class ComponentLoadedEffects {
  private actions$ = inject(Actions);

  // Effect để dispatch actions từ nhiều store khác nhau
  loadAllData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAllData), // Lắng nghe action loadAllData
      mergeMap(() => {
        // Dispatch actions để load dữ liệu từ Duty, Personnel, và Alert store
        return [
          NetworkSystemActions.loadNetworkSystems(),
          DutyActions.loadDutySchedule(),
          BtthActions.loadUnits(),
          MapStoreActions.refreshMap(),
          StatisticsStoreActions.refreshStatistics(),
          DateTimeRangeActionsV2.loadDateV2(),
          AlertDisconnectedActions.loadDisconnectedAlerts(),
          AlertSecurityActions.loadSecurityAlerts(),
          // SecurityStatsActions.refreshSecurityStats(),
          // DeviceStatsActions.refreshDeviceStats(),
          // EndpointStatsActions.refreshEndpointStats(),
        ];
      }),
    );
  });
}
