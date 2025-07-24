import { MapDeviceCount } from '../../../modules/dashboard/models/btth.interface';
import { StatsApiFilters } from '../device-stats/device-stats.models';

export interface MapApiFilters extends StatsApiFilters {
  pathLevel?: number;
}

export interface MapState {
  currentLevel: number;
  deviceData: MapDeviceCount[];
  securityData: MapDeviceCount[];
  apiFilters: MapApiFilters;
  isLoading: boolean;
  error: string | null;
}
