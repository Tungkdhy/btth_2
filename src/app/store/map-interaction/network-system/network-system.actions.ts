import { createAction, props } from '@ngrx/store';
import { NetworkSystem } from '../../../modules/dashboard/models/btth.interface';

export const loadNetworkSystems = createAction(
  '[Network System] Load Network Systems',
);
export const loadNetworkSystemsSuccess = createAction(
  '[Network System] Load Network Systems Success',
  props<{ networkSystems: NetworkSystem[] }>(),
);
export const loadNetworkSystemsFailure = createAction(
  '[Network System] Load Network Systems Failure',
  props<{ error: any }>(),
);
