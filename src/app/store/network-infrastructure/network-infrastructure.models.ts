import {
  DeviceType,
  EndpointType,
} from '../../modules/dashboard/models/btth.type';
import {
  NetworkInfrastructureTreeCount,
  UnitPath,
} from '../../modules/dashboard/models/btth.interface';

export interface NetworkInfrastructureApiFilters {
  mainType: DeviceType | null;
  subType: string | null;
  endpointType: string | null;
  coreLayerName: string | null;
  boundaryLayerName: string | null;
  isAuto: boolean;
}

export interface NetworkInfrastructureFilters {
  type: DeviceType | null;
  unitPath: string | null;
  unitName: string | null;
  coreLayerName: string | null;
  boundaryLayerName: string | null;
  total: number | null;
  status: boolean | null;
}

export interface NetworkInfrastructureState {
  data: NetworkInfrastructureTreeCount[];
  loading: boolean;
  error: any;
  apiFilters: NetworkInfrastructureApiFilters;
  filters: NetworkInfrastructureFilters;
}

export const networkInfrastructureInitialState: NetworkInfrastructureState = {
  data: [],
  loading: false,
  error: null,
  apiFilters: {
    mainType: null,
    subType: UnitPath.ROOT,
    endpointType: null,
    coreLayerName: null,
    boundaryLayerName: null,
    isAuto: false,
  },
  filters: {
    type: null,
    unitPath: null,
    unitName: null,
    coreLayerName: null,
    boundaryLayerName: null,
    total: null,
    status: null,
  },
};
