import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../modules/keycloak/services/auth.guard';
import { Constant } from '../../../core/config/constant';
import { ComputerRouting } from './computer-routing';

const routes: Routes = [
  {
    path: 'may-chu',
    children: ComputerRouting,
    canActivate: [AuthGuard],
    data: {
      type: Constant.TYPE_DEVICE.SERVER,
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: 'may-tram',
    children: ComputerRouting,
    canActivate: [AuthGuard],
    data: {
      type: Constant.TYPE_DEVICE.CLIENT,
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  { path: '', redirectTo: 'may-chu', pathMatch: 'full' },
  { path: '**', redirectTo: 'may-chu', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComputerServerRoutingModule {}
