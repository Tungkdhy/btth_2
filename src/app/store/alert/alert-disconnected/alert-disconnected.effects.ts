import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, interval, tap, startWith } from 'rxjs';
import {switchMap, catchError, map, mergeMap} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MapSupabaseService } from '../../../modules/dashboard/services/map-supabase.service';
import {
  loadDisconnectedAlerts,
  loadDisconnectedAlertsSuccess,
} from './alert-disconnected.actions';
import * as NetworkInfrastructureEndpointActions from '../../network-infrastructure-endpoint/network-infrastructure-endpoint.actions';
import { start } from '@popperjs/core';
import {Constant} from "../../../core/config/constant";

@Injectable()
export class AlertDisconnectedEffects {
  private actions$ = inject(Actions);
  private networkService = inject(MapSupabaseService);

  loadAlerts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadDisconnectedAlerts), // Every 30 seconds
      switchMap(() =>  interval(Constant.TIMER.ALERT_INTERVAL).pipe(
        startWith(0),
        switchMap(() =>
          this.networkService.getDisconnectAlertList({ limit: 99999 }).pipe(
            map((alerts) => loadDisconnectedAlertsSuccess({ alerts })),
            catchError(() =>
              of({ type: '[Alert Disconnected] Load Alerts Failure' }),
            ),
          ),
        ),
      ))

    )
    // return interval(30000).pipe(
    //   startWith(0),
    //   switchMap(() =>
    //     this.networkService.getDisconnectAlertList({ limit: 99999 }).pipe(
    //       map((alerts) => loadDisconnectedAlertsSuccess({ alerts })),
    //       catchError(() =>
    //         of({ type: '[Alert Disconnected] Load Alerts Failure' }),
    //       ),
    //     ),
    //   ),
    // );
  });
}
