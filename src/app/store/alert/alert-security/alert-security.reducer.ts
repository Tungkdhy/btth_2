import { createReducer, on } from '@ngrx/store';
import {
  AlertListPagination,
  InfoSecAlertData,
} from '../../../modules/dashboard/models/btth.interface';
import {
  loadSecurityAlerts,
  loadSecurityAlertsSuccess,
} from './alert-security.actions';

export interface AlertSecurityState {
  alerts: AlertListPagination<InfoSecAlertData>;
  hasNewAlert: boolean;
}

const initialState: AlertSecurityState = {
  alerts: {
    total: 0,
    limit: 5,
    page: 1,
    data: [],
  },
  hasNewAlert: false,
};

export const alertSecurityReducer = createReducer(
  initialState,
  on(loadSecurityAlertsSuccess, (state, { alerts }) => ({
    ...state,
    alerts,
    // hasNewAlert: alerts.some((alert) => !alert.viewed), // Assume 'viewed' is a flag in SecurityInfo
  })),
  // on(markSecurityAlertAsViewed, (state, { alertId }) => ({
  //   ...state,
  //   alerts: state.alerts.map((alert) =>
  //     alert.id === alertId ? { ...alert, viewed: true } : alert,
  //   ),
  //   hasNewAlert: state.alerts.some((alert) => !alert.viewed),
  // })),
);
