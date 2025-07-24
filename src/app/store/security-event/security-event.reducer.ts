import { createReducer, on } from '@ngrx/store';
import * as SecurityEventActions from './security-event.actions';
import { initialSecurityEventState } from './security-event.models';
import * as NetworkInfrastructureActions from '../network-infrastructure/network-infrastructure.actions';

export const securityEventReducer = createReducer(
  initialSecurityEventState,
  on(SecurityEventActions.loadSecurityEventTreeCount, (state, action) => ({
    ...state,
    loading: true,
    error: null,
    apiFilters: {
      mainType: action.mainType,
      subType: action.subType,
      alertType: action.alertType,
      coreLayerName: action.coreLayerName,
      boundaryLayerName: action.boundaryLayerName,
      isAuto: action.isAuto,
      warningLevel: action.warningLevel,
      fromDate: action.fromDate,
      toDate: action.toDate,
    },
  })),
  on(SecurityEventActions.updateSecurityEventFilters, (state, { filters }) => ({
    ...state,
    filters: {
      ...state.filters, // giữ lại các giá trị cũ của filters
      ...filters, // chỉ ghi đè những thuộc tính được truyền vào
    },
  })),
  on(
    SecurityEventActions.loadSecurityEventTreeCountSuccess,
    (state, { data }) => ({
      ...state,
      loading: false,
      error: null,
      data, // Cập nhật dữ liệu khi load thành công
    }),
  ),
  on(
    SecurityEventActions.loadSecurityEventTreeCountFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error, // Cập nhật lỗi nếu có
    }),
  ),
);
