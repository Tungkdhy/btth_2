import {
  AlertType,
  ApiFilter,
  CoreCode,
  MainType,
  MapDeviceCount,
  SysTypes,
  UnitPath,
} from '../../../modules/dashboard/models/btth.interface';
import {
  getEndOfDay,
  getStartOfDay,
} from '../../../_metronic/layout/core/common/common-utils';
import { defaultFilters } from '../map-interaction-utils';

export interface StatsApiFilters
  extends Pick<
    ApiFilter,
    | 'mainType'
    | 'subTypeList'
    | 'core'
    | 'boundary'
    | 'coreList'
    | 'boundaryList'
    | 'fromDate'
    | 'toDate'
  > {
  isFetchCore: boolean;
  isFetchBoundary: boolean;
  systemType: SysTypes | null;
  alertType: string | null;
}

export interface StatsState {
  rawData: any[];
  data: MapDeviceCount[];
  loading: boolean;
  error: any;
  apiFilters: StatsApiFilters;
}

export const statsInitialState: StatsState = {
  rawData: [],
  data: [],
  loading: false,
  error: null,
  apiFilters: defaultFilters,
};
