import { createAction, props } from '@ngrx/store';

export const setStartDateV2 = createAction(
  '[Date Picker V2] Set Start Date',
  props<{ startDate: Date }>(),
);

export const setEndDateV2 = createAction(
  '[Date Picker V2] Set End Date',
  props<{ endDate: Date }>(),
);

export const setDateV2 = createAction(
  '[Date Picker V2] Set Date',
  props<{ startDate: Date; endDate: Date }>(),
);

export const loadDateV2 = createAction('[Date Picker V2] Load Date');
