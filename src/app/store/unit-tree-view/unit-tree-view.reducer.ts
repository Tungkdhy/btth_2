// import { createReducer, on } from '@ngrx/store';
// import {
//   setCurrentUnitId,
//   setPreviousUnitId,
//   setRootUnitId,
//   setUnitTreeView,
// } from './unit-tree-view.actions';
// // import { UnitDetailIntegrationModel } from '../../modules/unit/models/unit-detail-integration.model';

// export interface UnitTreeViewState {
//   // units: UnitDetailIntegrationModel[];
//   currentUnitId: string | null;
//   rootUnitId: string | null;
//   previousUnitId: string | null;
// }

// export const initialUnitTreeViewState: UnitTreeViewState = {
//   // units: [],
//   currentUnitId: null,
//   rootUnitId: null,
//   previousUnitId: null,
// };

// export const unitTreeViewReducer = createReducer(
//   initialUnitTreeViewState,
//   on(setUnitTreeView, (state, { units }) => ({
//     ...state,
//     units,
//     rootUnitId: units.length > 0 ? units[0].id : null,
//   })),
//   on(setCurrentUnitId, (state, { currentUnitId }) => ({
//     ...state,
//     previousUnitId: state.currentUnitId,
//     currentUnitId: currentUnitId,
//   })),
//   on(setRootUnitId, (state, { rootUnitId }) => ({ ...state, rootUnitId })),
//   on(setPreviousUnitId, (state, { previousUnitId }) => ({
//     ...state,
//     previousUnitId,
//   })),
// );
