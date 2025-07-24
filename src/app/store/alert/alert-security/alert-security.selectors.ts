import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { groupAlertsByUnitPath } from '../../map-interaction/map-interaction-utils';
import {
  selectUnits,
  selectUnitNameByPath,
} from '../../unit-btth/unit-btth.selectors';
import { AlertSecurityState } from './alert-security.reducer';
import { Constant } from '../../../core/config/constant';

export const selectAlertState =
  createFeatureSelector<AlertSecurityState>('alertsSecurity');

export const selectAlerts = createSelector(
  selectAlertState,
  (state) => state.alerts,
);

export const selectAlertSecurityStats = createSelector(
  selectAlerts, // First selector: get alerts
  selectUnits, // Second selector: get all units
  (alerts, units) => {
    const groupedAlerts = groupAlertsByUnitPath(alerts.data); // Group alerts by unitPath, etc.

    // Map through grouped alerts and add the unit name by using selectUnitNameByPath
    return groupedAlerts.map((group) => {
      // Find unit name from units store using the unitPath
      const unit = units.find((u) => u.path === group.unitPath);
      const unitName = unit
        ? unit.name
        : Constant.DEFAULT_VALUES.UNDEFINED_NAME; // Default to 'Unknown' if unit not found

      return {
        ...group,
        name: unitName, // Replace or set the name property with the unit name
      };
    });
  },
);

export const selectAlertSecurityTotal = createSelector(
  selectAlertState,
  (state) => state.alerts.total,
);
// export const selectHasNewAlert = createSelector(selectAlertState, (state) => state.hasNewAlert);
// export const selectAlertCount = createSelector(selectAlertState, (state) => state.alerts.length);
