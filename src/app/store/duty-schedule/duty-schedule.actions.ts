import { createAction, props } from '@ngrx/store';
import {
  DutySchedule,
  UnitDutyDetail,
} from '../../modules/dashboard/models/btth.interface';

export const loadDutySchedule = createAction('[Duty] Load Duty Schedule');
export const loadDutyScheduleSuccess = createAction(
  '[Duty] Load Duty Schedule Success',
  props<{ dutySchedule: DutySchedule }>(),
);
export const loadDutyScheduleFailure = createAction(
  '[Duty] Load Duty Schedule Failure',
  props<{ error: any }>(),
);

export const loadUnitDutyById = createAction(
  '[Duty] Load Unit Duty By Id',
  props<{ unitId: string }>(),
);
export const loadUnitDutyByIdSuccess = createAction(
  '[Duty] Load Unit Duty By Id Success',
  props<{ unitDutyDetail: UnitDutyDetail }>(),
);
export const loadUnitDutyByIdFailure = createAction(
  '[Duty] Load Unit Duty By Id Failure',
  props<{ error: any }>(),
);
