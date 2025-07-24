import { createFeatureSelector, createSelector } from '@ngrx/store';
import { formatDate } from '@angular/common';
import { DateTimeRangeStateV2 } from './date-time-range-v2.model';

export const selectDateRangeV2 =
  createFeatureSelector<DateTimeRangeStateV2>('dateRangeV2');

export const selectStartDate = createSelector(
  selectDateRangeV2,
  (state: DateTimeRangeStateV2) => state.startDate,
);

export const selectEndDate = createSelector(
  selectDateRangeV2,
  (state: DateTimeRangeStateV2) => state.endDate,
);
export const selectLoading = createSelector(
  selectDateRangeV2,
  (state: DateTimeRangeStateV2) => state.loading,
);

export const selectDateV2 = createSelector(
  selectDateRangeV2,
  (state: DateTimeRangeStateV2) => {
    if (state.loading) {
      return {
        startDate: null,
        endDate: null,
      };
    }
    return {
      startDate: state.startDate,
      endDate: state.endDate,
    };
  },
);
