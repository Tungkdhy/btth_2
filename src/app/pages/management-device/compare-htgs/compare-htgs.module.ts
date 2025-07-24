import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticCompareHtgsComponent } from '../../../modules/compare-htgs/components/statistic-compare-htgs/statistic-compare-htgs.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticCompareHtgsComponent,
    children: [
      {
        path: 'thiet-bi-mang',
        loadChildren: () =>
          import('./statistic-device-compare-htgs-routing.module').then(
            (m) => m.StatisticDeviceCompareHtgsRoutingModule,
          ),
      },
      {
        path: 'thiet-bi-dau-cuoi',
        loadChildren: () =>
          import('./statistic-endpoint-compare-htgs-routing.module').then(
            (m) => m.StatisticEndpointCompareHtgsRoutingModule,
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class CompareHtgsModule {}
