import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DateTimeRangeState } from './date-time-range.model';
import { formatDate } from '@angular/common';

export const selectDateRange =
  createFeatureSelector<DateTimeRangeState>('dateRange');

export const selectStartDate = createSelector(
  selectDateRange,
  (state: DateTimeRangeState) => state.startDate,
);

export const selectEndDate = createSelector(
  selectDateRange,
  (state: DateTimeRangeState) => state.endDate,
);

export const selectDate = createSelector(
  selectDateRange,
  (state: DateTimeRangeState) => {
    return {
      startDate: state.startDate,
      endDate: state.endDate,
    };
  },
);

export const selectFormattedDateRange = createSelector(
  selectDateRange,
  (state: DateTimeRangeState) => {
    const format = 'yyyy-MM-dd HH:mm:ss';
    const locale = 'en-US'; // Bạn có thể thay đổi ngôn ngữ cho phù hợp
    const now = new Date(); // Lấy thời gian hiện tại

    return {
      startDate: state.startDate
        ? formatDate(state.startDate, format, locale)
        : formatDate(now, format, locale),
      endDate: state.endDate
        ? formatDate(state.endDate, format, locale)
        : formatDate(now, format, locale),
    };
  },
);
