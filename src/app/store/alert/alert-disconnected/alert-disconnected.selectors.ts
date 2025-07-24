import { AlertDisconnectedState } from './alert-disconnected.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { groupAlertsByUnitPath } from '../../map-interaction/map-interaction-utils';

export const selectAlertState =
  createFeatureSelector<AlertDisconnectedState>('alertsDisconnected');

export const selectAlerts = createSelector(
  selectAlertState,
  (state) => state.alerts,
);

export const selectAlertDisconnectedStats = createSelector(
  selectAlertState,
  (state) => groupAlertsByUnitPath(state.alerts.data),
);

export const selectAlertDisconnectedTotal = createSelector(
  selectAlertState,
  (state) => state.alerts.total,
);
// export const selectHasNewAlert = createSelector(selectAlertState, (state) => state.hasNewAlert);
// export const selectAlertCount = createSelector(selectAlertState, (state) => state.alerts.length);
