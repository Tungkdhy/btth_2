import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as UnitActions from './unit-btth.actions';
import { UnitBtth } from '../../modules/dashboard/models/btth.interface';
import { MapSupabaseService } from '../../modules/dashboard/services/map-supabase.service';

@Injectable()
export class UnitEffects {
  private actions$: Actions = inject(Actions);
  private unitService: MapSupabaseService = inject(MapSupabaseService);

  loadUnits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UnitActions.loadUnits),
      switchMap(() =>
        this.unitService.getUnits().pipe(
          map((units: UnitBtth[]) => UnitActions.loadUnitsSuccess({ units })),
          catchError((error) => of(UnitActions.loadUnitsFailure({ error }))),
        ),
      ),
    );
  });
}
