import { createReducer, on } from '@ngrx/store';
import {
  loadDateV2,
  setDateV2,
  setEndDateV2,
  setStartDateV2,
} from './date-time-range-v2.actions';
import { DateTimeRangeStateV2 } from './date-time-range-v2.model';

export const initialState: DateTimeRangeStateV2 = {
  // startDate: getCustomDateTime(today, 0, 0, 0),
  // endDate: getCustomDateTime(today, 23, 59, 59),
  startDate: null,
  endDate: null,
  loading: false,
};

export const dateRangeV2Reducer = createReducer(
  initialState,
  on(loadDateV2, (state) => ({ ...state, loading: true })),
  on(setStartDateV2, (state, { startDate }) => ({ ...state, startDate })),
  on(setEndDateV2, (state, { endDate }) => ({ ...state, endDate })),
  on(setDateV2, (state, { startDate, endDate }) => ({
    ...state,
    startDate,
    endDate,
    loading: false, // Đặt loading về false khi dữ liệu đã được tải xong
  })),
);
