import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCompareHtgsComponent } from '../../../modules/compare-htgs/components/list-compare-htgs/list-compare-htgs.component';

const routes: Routes = [
  {
    path: '',
    component: ListCompareHtgsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticDeviceCompareHtgsRoutingModule {}
