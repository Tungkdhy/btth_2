import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../../core/config/constant';
import { AuthGuard } from '../../../modules/keycloak/services/auth.guard';
import { ToolsMonitoringSystemRouting } from './tools-monitoring-system-routing';
import { ToolsStatisticsComponent } from 'src/app/modules/tools-statistics/components/tools-statistics.component';

const routes: Routes = [
  {
    path: 'quan-ly',
    children: ToolsMonitoringSystemRouting,
    //canActivate: [AuthGuard],
    // data: {
    //   //type: Constant.TYPE_DEVICE.ROUTER,
    //   roles: [
    //     Constant.REALM_ROLES.MANAGER,
    //     Constant.REALM_ROLES.VIEWER,
    //     Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
    //   ],
    // },
  },
  {
    path: 'thong-ke',
    component: ToolsStatisticsComponent
    // canActivate: [AuthGuard],
    // data: {
    //   //type: Constant.TYPE_DEVICE.SWITCH,
    //   roles: [
    //     Constant.REALM_ROLES.MANAGER,
    //     Constant.REALM_ROLES.VIEWER,
    //     Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
    //   ],
    // },
    
  },

  {
    path: '',
    redirectTo: 'quan-ly',
    pathMatch: 'full',
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
export class ToolsMonitoringSystemModule { }
