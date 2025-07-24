import { AlertDisconnected } from './alert-disconnected.model';
import { createReducer, on } from '@ngrx/store';
import {
  loadDisconnectedAlertsSuccess,
  markDisconnectedAlertAsViewed,
} from './alert-disconnected.actions';
import {
  AlertListPagination,
  InfraAlertData,
} from '../../../modules/dashboard/models/btth.interface';

export interface AlertDisconnectedState {
  alerts: AlertListPagination<InfraAlertData>;
  hasNewAlert: boolean;
}

const initialState: AlertDisconnectedState = {
  alerts: {
    total: 0,
    limit: 5,
    page: 1,
    data: [],
  },
  hasNewAlert: false,
};

export const alertDisconnectedReducer = createReducer(
  initialState,
  on(loadDisconnectedAlertsSuccess, (state, { alerts }) => ({
    ...state,
    alerts,
    // hasNewAlert: alerts.some((alert) => !alert.viewed), // Assume 'viewed' is a flag in SecurityInfo
  })),
  // on(markDisconnectedAlertAsViewed, (state, { alertId }) => ({
  //   ...state,
  //   alerts: state.alerts.map((alert) =>
  //     alert.id === alertId ? { ...alert, viewed: true } : alert,
  //   ),
  //   hasNewAlert: state.alerts.some((alert) => !alert.viewed),
  // })),
);
