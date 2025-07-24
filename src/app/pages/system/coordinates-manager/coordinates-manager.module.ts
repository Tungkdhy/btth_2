import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapCoordinateGridComponent } from '../../../modules/map-coordinate/components/map-coordinate-grid/map-coordinate-grid.component';
import { MapCoordinateDetailComponent } from '../../../modules/map-coordinate/components/map-coordinate-detail/map-coordinate-detail.component';
import { loadMapCoordinates } from '../../../store/map-coordinate/map-coordinate.actions';
import { Store } from '@ngrx/store';

const routes: Routes = [
  {
    path: '',
    component: MapCoordinateGridComponent,
  },
  {
    path: 'chi-tiet/:id',
    component: MapCoordinateDetailComponent,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '*',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CoordinatesManagerModule {
  constructor(private store: Store) {
    this.store.dispatch(loadMapCoordinates());
  }
}
