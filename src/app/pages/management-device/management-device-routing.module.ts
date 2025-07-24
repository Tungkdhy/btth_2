import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../core/config/constant';
import { AuthGuard } from '../../modules/keycloak/services/auth.guard';
import { ReferenceDeviceComponent } from '../../modules/reference/components/reference-device/reference-device.component';

const routes: Routes = [
  {
    path: 'thiet-bi-mang',
    loadChildren: () =>
      import('./network-device/network-device-routing.module').then(
        (m) => m.NetworkDeviceRoutingModule,
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
    path: 'may-tinh',
    loadChildren: () =>
      import('./computer/computer-routing.module').then(
        (m) => m.ComputerServerRoutingModule,
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
    path: 'tu-dong-hoa-chi-huy',
    loadChildren: () =>
      import('../command-automation/command-automation.module').then(
        (m) => m.CommandAutomationModule,
      ),
  },
  {
    path: 'anh-xa-thiet-bi',
    component: ReferenceDeviceComponent,
  },
  {
    path: '',
    redirectTo: 'thiet-bi-mang',
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
export class ManagementDeviceRoutingModule {}
