import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalMapComponent } from '../../../modules/digital-map/components/digital-map/digital-map.component';

const routes: Routes = [
  {
    path: '',
    component: DigitalMapComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DigitalMapRoutingModule {}
