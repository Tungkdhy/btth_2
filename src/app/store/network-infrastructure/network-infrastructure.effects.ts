import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, interval } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  startWith,
} from 'rxjs/operators';
import * as NetworkInfrastructureActions from './network-infrastructure.actions';
import { MapSupabaseService } from '../../modules/dashboard/services/map-supabase.service';
import { Store } from '@ngrx/store';
import { selectNetworkInfrastructureApiFilters } from './network-infrastructure.selectors';

@Injectable()
export class NetworkInfrastructureEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private networkService = inject(MapSupabaseService);

  loadTreeCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NetworkInfrastructureActions.loadNetworkInfrastructureTreeCount),
      mergeMap((action) =>
        this.networkService
          .getDeviceTreeCount(
            action.mainType,
            action.subType,
            action.endpointType,
            action.coreLayerName,
            action.boundaryLayerName,
            action.isAuto,
          )
          .pipe(
            map((data) =>
              NetworkInfrastructureActions.loadNetworkInfrastructureTreeCountSuccess(
                { data },
              ),
            ),
            catchError((error) =>
              of(
                NetworkInfrastructureActions.loadNetworkInfrastructureTreeCountFailure(
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
        NetworkInfrastructureActions.refreshNetworkInfrastructureTreeCount,
      ),
      switchMap(() =>
        this.store.select(selectNetworkInfrastructureApiFilters).pipe(
          switchMap((filters) =>
            interval(30000).pipe(
              startWith(0),
              switchMap(() =>
                this.networkService
                  .getDeviceTreeCount(
                    filters.mainType,
                    filters.subType,
                    filters.endpointType,
                    filters.coreLayerName,
                    filters.boundaryLayerName,
                    filters.isAuto,
                  )
                  .pipe(
                    map((data) =>
                      NetworkInfrastructureActions.loadNetworkInfrastructureTreeCountSuccess(
                        { data },
                      ),
                    ),
                    catchError((error) =>
                      of(
                        NetworkInfrastructureActions.loadNetworkInfrastructureTreeCountFailure(
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
