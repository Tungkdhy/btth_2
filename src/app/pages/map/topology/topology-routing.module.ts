import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopologyComponent } from '../../../modules/topology/components/topology/topology.component';

const routes: Routes = [
  {
    path: '',
    component: TopologyComponent,
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopologyRoutingModule {}
