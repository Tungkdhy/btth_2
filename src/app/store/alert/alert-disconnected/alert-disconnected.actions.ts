import { AlertDisconnected } from './alert-disconnected.model';
import { createAction, props } from '@ngrx/store';
import {
  AlertListPagination,
  InfraAlertData,
} from '../../../modules/dashboard/models/btth.interface';

export const loadDisconnectedAlerts = createAction(
  '[Alert Disconnected] Load Alerts',
);
export const loadDisconnectedAlertsSuccess = createAction(
  '[Alert Disconnected] Load Alerts Success',
  props<{ alerts: AlertListPagination<InfraAlertData> }>(),
);
export const markDisconnectedAlertAsViewed = createAction(
  '[Alert Disconnected] Mark Alert As Viewed',
  props<{ alertId: string }>(),
);
