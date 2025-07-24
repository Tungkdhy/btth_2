import { createReducer, on } from '@ngrx/store';
import { setStartDate, setEndDate, setDate } from './date-time-range.actions';
import { DateTimeRangeState } from './date-time-range.model';
import {
  calculateDateTimeRange,
  getCustomDateTime,
  getEightAMPreviousDay,
  getEightAMToday,
} from '../../_metronic/layout/core/common/common-utils';

const { startDate, endDate } = calculateDateTimeRange();
const today = new Date();
export const initialState: DateTimeRangeState = {
  // startDate: getCustomDateTime(today, 0, 0, 0),
  // endDate: getCustomDateTime(today, 23, 59, 59),
  startDate: startDate,
  endDate: endDate,
};

export const dateRangeReducer = createReducer(
  initialState,
  on(setStartDate, (state, { startDate }) => ({ ...state, startDate })),
  on(setEndDate, (state, { endDate }) => ({ ...state, endDate })),
  on(setDate, (state, { startDate, endDate }) => ({
    ...state,
    startDate,
    endDate,
  })),
);
