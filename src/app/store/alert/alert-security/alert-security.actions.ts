import { createAction, props } from '@ngrx/store';
import {
  AlertListPagination,
  InfoSecAlertData,
} from '../../../modules/dashboard/models/btth.interface';

export const loadSecurityAlerts = createAction('[Alert Security] Load Alerts');
export const loadSecurityAlertsSuccess = createAction(
  '[Alert Security] Load Alerts Success',
  props<{ alerts: AlertListPagination<InfoSecAlertData> }>(),
);
export const markSecurityAlertAsViewed = createAction(
  '[Alert Security] Mark Alert As Viewed',
  props<{ alertId: string }>(),
);
