// import { UnitCoordinate } from '../../modules/unit/models/unit.model';
// import { createReducer, on } from '@ngrx/store';
// import { loadDataFailure, loadDataSuccess } from './unit-coordinate.actions';

// export interface UnitCoordinateState {
//   units: UnitCoordinate[];
//   selectedUnitId?: string;
// }

// export const initialUnitCoordinateState: UnitCoordinateState = {
//   units: [],
//   selectedUnitId: undefined,
// };

// export const unitCoordinateReducer = createReducer<UnitCoordinateState>(
//   initialUnitCoordinateState,
//   on(loadDataSuccess, (state, { data }) => ({ ...state, units: data })),
//   on(loadDataFailure, (state, { error }) => ({ ...state, error })),
// );
