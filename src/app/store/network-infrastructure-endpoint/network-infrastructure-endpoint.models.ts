import {
  DeviceType,
  EndpointType,
} from '../../modules/dashboard/models/btth.type';
import {
  NetworkInfrastructureTreeCount,
  UnitPath,
} from '../../modules/dashboard/models/btth.interface';

export interface NetworkInfrastructureEndpointApiFilters {
  mainType: EndpointType | null;
  subType: string | null;
  endpointType: string | null;
  coreLayerName: string | null;
  boundaryLayerName: string | null;
  isAuto: boolean;
}

export interface NetworkInfrastructureEndpointFilters {
  type: EndpointType | null;
  unitPath: string | null;
  unitName: string | null;
  coreLayerName: string | null;
  boundaryLayerName: string | null;
  total: number | null;
  status: boolean | null;
}

export interface NetworkInfrastructureEndpointState {
  data: NetworkInfrastructureTreeCount[];
  loading: boolean;
  error: any;
  apiFilters: NetworkInfrastructureEndpointApiFilters;
  filters: NetworkInfrastructureEndpointFilters;
}

export const networkInfrastructureEndpointInitialState: NetworkInfrastructureEndpointState =
  {
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
