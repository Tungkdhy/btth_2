import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../../core/config/constant';
import { NetworkDeviceRouting } from './network-device-routing';
import { AuthGuard } from '../../../modules/keycloak/services/auth.guard';

const routes: Routes = [
  {
    path: 'thiet-bi-chuyen-mach',
    children: NetworkDeviceRouting,
    canActivate: [AuthGuard],
    data: {
      type: Constant.TYPE_DEVICE.SWITCH,
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: 'thiet-bi-dinh-tuyen',
    children: NetworkDeviceRouting,
    canActivate: [AuthGuard],
    data: {
      type: Constant.TYPE_DEVICE.ROUTER,
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: 'tuong-lua',
    children: NetworkDeviceRouting,
    canActivate: [AuthGuard],
    data: {
      type: Constant.TYPE_DEVICE.FIREWALL,
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: '',
    redirectTo: 'thiet-bi-dinh-tuyen',
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
export class NetworkDeviceRoutingModule {}
