import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticUnitComponent } from '../../modules/statistics/components/statistic-unit/statistic-unit.component';
import { StatisticsReferenceDeviceComponent } from '../../modules/statistics/components/statistics-reference-device/statistics-reference-device.component';
import { StatisticNetworkDeviceComponent } from '../../modules/statistics/components/statistic-network-device/statistic-network-device.component';
import { StatisticsMonitoringServerComponent } from '../../modules/statistics/components/statistics-monitoring-server/statistics-monitoring-server.component';

const routes: Routes = [
  {
    path: 'tinh-trang-thiet-bi',
    component: StatisticNetworkDeviceComponent,
    // data: { roles: ['manager', '3vp_manager'] },
  },
  {
    path: 'may-chu-giam-sat',
    component: StatisticsMonitoringServerComponent,
  },
  {
    path: 'anh-xa/don-vi',
    component: StatisticUnitComponent,
  },
  {
    path: 'anh-xa/thiet-bi',
    component: StatisticsReferenceDeviceComponent,
  },
  {
    path: 'doi-chieu-htgs',
    loadChildren: () =>
      import('../management-device/compare-htgs/compare-htgs.module').then(
        (m) => m.CompareHtgsModule,
      ),
  },
  {
    path: '',
    redirectTo: 'tinh-trang-thiet-bi',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class StatisticsModule {}
