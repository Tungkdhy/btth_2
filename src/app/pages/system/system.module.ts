import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { AuthGuard } from '../../modules/keycloak/services/auth.guard';
import { NeunLoadingComponent } from '../../shared/neun-loading/neun-loading.component';
import { Constant } from '../../core/config/constant';
import { ReferenceUnitComponent } from '../../modules/unit/components/reference-unit/reference-unit.component';

const routes: Routes = [
  {
    path: 'don-vi',
    loadChildren: () => import('./unit/unit.module').then((m) => m.UnitModule),
    canActivate: [AuthGuard],
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  // {
  //   path: 'he-thong-giam-sat',
  //   loadChildren: () =>
  //     import('../system/monitoring-system/monitoring-system.module').then(
  //       (m) => m.MonitoringSystemModule,
  //     ),
  //   canActivate: [AuthGuard],
  //   data: {
  //     roles: [
  //       Constant.REALM_ROLES.MANAGER,
  //       Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
  //     ],
  //   },
  // },
  // {
  //   path: 'canh-bao',
  //   loadChildren: () =>
  //     import(
  //       '../system/party-central-office-alerts/party-central-office-alerts.module'
  //     ).then((m) => m.PartyCentralOfficeAlertsModule),
  //   canActivate: [AuthGuard],
  //   data: { roles: ['manager', '3vp_manager'] },
  // },
  {
    path: 'nhom',
    loadChildren: () =>
      import('../system/groups-manager/groups-manager-routing.module').then(
        (m) => m.GroupsManagerRoutingModule,
      ),
    canActivate: [AuthGuard],
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: 'nguoi-dung',
    loadChildren: () =>
      import('../system/user-manager/user-manager-routing.module').then(
        (m) => m.UserManagerRoutingModule,
      ),
    canActivate: [AuthGuard],
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: 'toa-do',
    loadChildren: () =>
      import('../system/coordinates-manager/coordinates-manager.module').then(
        (m) => m.CoordinatesManagerModule,
      ),
    canActivate: [AuthGuard],
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: 'cau-hinh-canh-bao',
    loadChildren: () =>
      import('../system/alert-configuration/alert-configuration.module').then(
        (m) => m.AlertConfigurationModule,
      ),
    canActivate: [AuthGuard],
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: '',
    redirectTo: 'don-vi',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InlineSVGModule,
    TreeGridModule,
    NeunLoadingComponent,
  ],
})
export class SystemModule {}
