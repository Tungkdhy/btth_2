import {
  SecurityEventTreeCount,
  UnitPath,
} from '../../modules/dashboard/models/btth.interface';

export interface SecurityEventApiFilters {
  mainType: string | null;
  subType: string | null;
  alertType: string | null;
  coreLayerName: string | null;
  boundaryLayerName: string | null;
  isAuto: boolean;
  warningLevel: number | null;
  fromDate: string | null;
  toDate: string | null;
}
export interface SecurityEventFilters {
  type: string | null;
  unitPath: string | null;
  unitName: string | null;
  coreLayerName: string | null;
  boundaryLayerName: string | null;
  warningLevel: number | null;
}

export interface SecurityEventState {
  data: SecurityEventTreeCount[];
  loading: boolean;
  error: any;
  apiFilters: SecurityEventApiFilters;
  filters: SecurityEventFilters;
}

export const initialSecurityEventState: SecurityEventState = {
  data: [],
  loading: false,
  error: null,
  apiFilters: {
    mainType: null,
    subType: UnitPath.ROOT,
    alertType: null,
    coreLayerName: null,
    boundaryLayerName: null,
    isAuto: false,
    warningLevel: 3,
    fromDate: null,
    toDate: null,
  },
  filters: {
    type: null,
    unitPath: null,
    unitName: null,
    coreLayerName: null,
    boundaryLayerName: null,
    warningLevel: null,
  },
};
