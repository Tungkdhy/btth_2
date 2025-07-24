import { createReducer, on } from '@ngrx/store';
import * as DutyActions from './duty-schedule.actions';
import {
  DutySchedule,
  UnitDutyDetail,
} from '../../modules/dashboard/models/btth.interface';

export interface DutyState {
  dutySchedule: DutySchedule | null;
  unitDutyDetail: UnitDutyDetail | null;
  loading: boolean;
  error: any;
}

export const initialState: DutyState = {
  dutySchedule: null,
  unitDutyDetail: null,
  loading: false,
  error: null,
};

export const dutyReducer = createReducer(
  initialState,
  on(DutyActions.loadDutySchedule, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DutyActions.loadDutyScheduleSuccess, (state, { dutySchedule }) => ({
    ...state,
    loading: false,
    dutySchedule,
  })),
  on(DutyActions.loadDutyScheduleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(DutyActions.loadUnitDutyById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DutyActions.loadUnitDutyByIdSuccess, (state, { unitDutyDetail }) => ({
    ...state,
    loading: false,
    unitDutyDetail,
  })),
  on(DutyActions.loadUnitDutyByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
