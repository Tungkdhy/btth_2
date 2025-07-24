import { createAction, props } from '@ngrx/store';
import {
  SecurityEventApiFilters,
  SecurityEventFilters,
} from './security-event.models';
import { SecurityEventTreeCount } from '../../modules/dashboard/models/btth.interface';
import { DeviceType } from '../../modules/dashboard/models/btth.type';
import { NetworkInfrastructureApiFilters } from '../network-infrastructure/network-infrastructure.models';

export const loadSecurityEventTreeCount = createAction(
  '[Security Event] Load Security Event Tree Count',
  props<{
    mainType: string | null;
    subType: string | null;
    alertType: string | null;
    coreLayerName: string | null;
    boundaryLayerName: string | null;
    isAuto: boolean;
    warningLevel: number | null;
    fromDate: string | null;
    toDate: string | null;
  }>(),
);

export const loadSecurityEventTreeCountSuccess = createAction(
  '[Security Event] Load Security Event Tree Count Success',
  props<{ data: SecurityEventTreeCount[] }>(),
);

export const loadSecurityEventTreeCountFailure = createAction(
  '[Security Event] Load Security Event Tree Count Failure',
  props<{ error: any }>(),
);

export const updateSecurityEventFilters = createAction(
  '[Security Event] Update Filters',
  props<{ filters: Partial<SecurityEventFilters> }>(), // Sử dụng Partial để cho phép truyền một phần của filters
);

export const refreshSecurityEventTreeCount = createAction(
  '[Security Event] Refresh Security Event Tree Count',
);
