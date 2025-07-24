import { createReducer, on } from '@ngrx/store';
import { UnitBtth } from '../../modules/dashboard/models/btth.interface';
import * as UnitActions from './unit-btth.actions';

export interface UnitState {
  units: UnitBtth[];
  loading: boolean;
  error: any;
}

export const initialState: UnitState = {
  units: [],
  loading: false,
  error: null,
};

export const unitReducer = createReducer(
  initialState,

  on(UnitActions.loadUnits, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UnitActions.loadUnitsSuccess, (state, { units }) => ({
    ...state,
    units: units,
    loading: false,
    error: null,
  })),

  on(UnitActions.loadUnitsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),
);
