import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../core/config/constant';
import { AuthGuard } from '../../modules/keycloak/services/auth.guard';
import { ToolsTA21Component } from 'src/app/modules/tools-ta21/components/tools-ta21.component';
import { ToolsWafsComponent } from 'src/app/modules/tools-wafs/components/tools-wafs.component';

const routes: Routes = [
  {
    path: 'he-thong-giam-sat',
    loadChildren: () =>
      import('./tools-monitoring-system/tools-monitoring-system.module').then(
        (m) => m.ToolsMonitoringSystemModule,
      ),
    canActivate: [AuthGuard],
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: 'ta21',
    // loadChildren: () =>
    //   import('./tools-monitoring-system/tools-monitoring-system.module').then(
    //     (m) => m.ToolsMonitoringSystemModule,
    //   ),
    // canActivate: [AuthGuard],
    component: ToolsTA21Component,
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: 'wafs',
    // loadChildren: () =>
    //   import('./tools-monitoring-system/tools-monitoring-system.module').then(
    //     (m) => m.ToolsMonitoringSystemModule,
    //   ),
    // canActivate: [AuthGuard],
    component: ToolsWafsComponent,
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: '',
    redirectTo: 'he-thong-giam-sat',
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
export class ToolsModule {}
