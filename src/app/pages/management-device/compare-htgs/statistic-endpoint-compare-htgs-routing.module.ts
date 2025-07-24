import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEndpointHtgsComponent } from '../../../modules/compare-htgs/components/list-endpoint-htgs/list-endpoint-htgs.component';

const routes: Routes = [
  {
    path: '',
    component: ListEndpointHtgsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticEndpointCompareHtgsRoutingModule {}
