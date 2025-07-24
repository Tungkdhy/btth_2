import { createSelector, createFeatureSelector } from '@ngrx/store';
import { DutyState } from './duty-schedule.reducer';

export const selectDutyState = createFeatureSelector<DutyState>('duty');

export const selectDutySchedule = createSelector(
  selectDutyState,
  (state: DutyState) => state.dutySchedule,
);

export const selectUnitDutyById = createSelector(
  selectDutyState,
  (state: DutyState) => state.unitDutyDetail,
);

export const selectDutyByUnitName = (unitName: string) =>
  createSelector(selectDutySchedule, (dutySchedule) => {
    return dutySchedule?.dutySchedules.find(
      (duty) => duty.unitName === unitName,
    );
  });

export const selectDutyByUnitId = (unitId: string) =>
  createSelector(selectDutySchedule, (dutySchedule) => {
    return dutySchedule?.dutySchedules.find((duty) => duty.unitId === unitId);
  });
