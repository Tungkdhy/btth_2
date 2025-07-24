import { createAction, props } from '@ngrx/store';
import { UnitBtth } from '../../modules/dashboard/models/btth.interface';

export const loadUnits = createAction('[Unit] Load Units');

export const loadUnitsSuccess = createAction(
  '[Unit] Load Units Success',
  props<{ units: UnitBtth[] }>(),
);

export const loadUnitsFailure = createAction(
  '[Unit] Load Units Failure',
  props<{ error: any }>(),
);
