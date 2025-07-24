import { StatsApiFilters } from './device-stats/device-stats.models';
import {
  CoreCode,
  GroupedAlerts,
  InfoSecAlertData,
  InfraAlertData,
  MainType,
  UnitPath,
} from '../../modules/dashboard/models/btth.interface';
import {
  calculateDateTimeRange,
  getEndOfDay,
  getStartOfDay,
} from '../../_metronic/layout/core/common/common-utils';
import { MapApiFilters } from './map-store/map-store.model';
import { Constant } from '../../core/config/constant';

const { startDate, endDate } = calculateDateTimeRange();

export const defaultFilters: StatsApiFilters = {
  mainType: MainType.MILITARY,
  subTypeList: [UnitPath.QS_QP],
  core: null,
  boundary: null,
  coreList: [CoreCode.A40, CoreCode.A91, CoreCode.A99],
  boundaryList: [],
  fromDate: startDate,
  toDate: endDate,
  isFetchCore: true,
  isFetchBoundary: false,
  systemType: null,
  alertType: null,
};

export function groupAlertsByUnitPath(alerts: any[]): GroupedAlerts[] {
  const grouped = alerts.reduce(
    (acc, alert) => {
      const name = alert.name || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
      const key = `${alert.unitPath}_${name}_${alert.core}_${alert.boundary}`;

      if (!acc[key]) {
        acc[key] = {
          unitPath: alert.unitPath,
          name: name,
          core: alert.core,
          boundary: alert.boundary,
          count: 0,
          remedyStatus: alert.remedy.status
        };
      }

      acc[key].count += 1; // Increment the count for this group

      return acc;
    },
    {} as Record<string, GroupedAlerts>,
  );

  // Convert the grouped object into an array
  return Object.values(grouped);
}

export function getRegionNameForCoreLayer(coreCode?: string) {
  if (!coreCode) return Constant.DEFAULT_VALUES.UNDEFINED_NAME;
  let key: any = {
    A40: 'Miền Bắc',
    A91: 'Miền Trung',
    A99: 'Miền Nam',
  };
  return key[coreCode] || '';
}
