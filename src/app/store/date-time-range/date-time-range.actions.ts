import { createAction, props } from '@ngrx/store';

export const setStartDate = createAction(
  '[Date Picker] Set Start Date',
  props<{ startDate: Date }>(),
);

export const setEndDate = createAction(
  '[Date Picker] Set End Date',
  props<{ endDate: Date }>(),
);

export const setDate = createAction(
  '[Date Picker] Set Date',
  props<{ startDate: Date; endDate: Date }>(),
);
