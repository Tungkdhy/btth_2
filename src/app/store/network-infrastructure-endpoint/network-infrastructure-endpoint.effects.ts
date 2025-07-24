import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, interval, tap } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  startWith,
} from 'rxjs/operators';
import * as NetworkInfrastructureEndpointActions from './network-infrastructure-endpoint.actions';
import { MapSupabaseService } from '../../modules/dashboard/services/map-supabase.service';
import { Store } from '@ngrx/store';
import { selectNetworkInfrastructureEndpointApiFilters } from './network-infrastructure-endpoint.selectors';
import * as SecurityEventActions from '../security-event/security-event.actions';
import { selectDate } from '../date-time-range/date-time-range.selectors';
import { selectSecurityEventApiFilters } from '../security-event/security-event.selectors';
import { formatDateTime } from '../../_metronic/layout/core/common/common-utils';

@Injectable()
export class NetworkInfrastructureEndpointEndpointEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private networkService = inject(MapSupabaseService);

  loadTreeCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        NetworkInfrastructureEndpointActions.loadNetworkInfrastructureEndpointTreeCount,
      ),
      mergeMap((action) =>
        this.networkService
          .getEndpointTreeCount(
            action.mainType,
            action.subType,
            action.endpointType,
            action.coreLayerName,
            action.boundaryLayerName,
            action.isAuto,
          )
          .pipe(
            map((data) =>
              NetworkInfrastructureEndpointActions.loadNetworkInfrastructureEndpointTreeCountSuccess(
                { data },
              ),
            ),
            tap((data) => console.log(data)),
            catchError((error) =>
              of(
                NetworkInfrastructureEndpointActions.loadNetworkInfrastructureEndpointTreeCountFailure(
                  { error },
                ),
              ),
            ),
          ),
      ),
    );
  });

  refreshTreeCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        NetworkInfrastructureEndpointActions.refreshNetworkInfrastructureEndpointTreeCount,
      ), // Lắng nghe action refresh
      switchMap(() =>
        this.store.select(selectNetworkInfrastructureEndpointApiFilters).pipe(
          switchMap((filters) =>
            interval(30000).pipe(
              startWith(0),
              switchMap(() =>
                this.networkService
                  .getEndpointTreeCount(
                    filters.mainType,
                    filters.subType,
                    filters.endpointType,
                    filters.coreLayerName,
                    filters.boundaryLayerName,
                    filters.isAuto,
                  )
                  .pipe(
                    map((data) =>
                      NetworkInfrastructureEndpointActions.loadNetworkInfrastructureEndpointTreeCountSuccess(
                        { data },
                      ),
                    ),
                    catchError((error) =>
                      of(
                        NetworkInfrastructureEndpointActions.loadNetworkInfrastructureEndpointTreeCountFailure(
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
    );
  });
}
