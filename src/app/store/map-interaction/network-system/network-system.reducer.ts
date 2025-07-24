import { createReducer, on } from '@ngrx/store';
import * as NetworkSystemActions from './network-system.actions';
import { NetworkSystem } from '../../../modules/dashboard/models/btth.interface';

export interface State {
  networkSystems: NetworkSystem[];
  error: any;
}

export const initialState: State = {
  networkSystems: [],
  error: null,
};

export const networkSystemReducer = createReducer(
  initialState,
  on(
    NetworkSystemActions.loadNetworkSystemsSuccess,
    (state, { networkSystems }) => ({
      ...state,
      networkSystems,
    }),
  ),
  on(NetworkSystemActions.loadNetworkSystemsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);
