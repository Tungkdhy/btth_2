import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as NetworkSystemActions from './network-system.actions';
import { MapSupabaseService } from '../../../modules/dashboard/services/map-supabase.service';
import { NetworkSystem } from '../../../modules/dashboard/models/btth.interface';

@Injectable()
export class NetworkSystemEffects {
  private actions$: Actions = inject(Actions);
  private mapSupabase: MapSupabaseService = inject(MapSupabaseService);

  loadNetworkSystems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NetworkSystemActions.loadNetworkSystems),
      mergeMap(() =>
        this.mapSupabase.getNetworkSystem().pipe(
          map((networkSystems: NetworkSystem[]) => {
            return NetworkSystemActions.loadNetworkSystemsSuccess({
              networkSystems,
            });
          }),
          catchError((error) =>
            of(NetworkSystemActions.loadNetworkSystemsFailure({ error })),
          ),
        ),
      ),
    );
  });
}
