import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertConfigurationComponent } from '../../../modules/alert-configuration/components/alert-configuration/alert-configuration.component';

const routes: Routes = [
  {
    path: '',
    component: AlertConfigurationComponent,
  },
  // {
  //   path: 'chi-tiet/:id',
  //   component: MapCoordinateDetailComponent,
  // },
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
export class AlertConfigurationModule {}
