import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../core/config/constant';
import { AuthGuard } from '../../modules/keycloak/services/auth.guard';

const routes: Routes = [
  {
    path: 'ban-do-hanh-chinh',
    loadChildren: () =>
      import('./digital-map/digital-map-routing.module').then(
        (m) => m.DigitalMapRoutingModule,
      ),
    canActivate: [AuthGuard],
    data: {
      roles: [Constant.REALM_ROLES.MANAGER, Constant.REALM_ROLES.VIEWER],
    },
  },
  {
    path: 'ban-do-cau-truc-mang',
    loadChildren: () =>
      import('./topology/topology-routing.module').then(
        (m) => m.TopologyRoutingModule,
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
    path: '',
    redirectTo: 'ban-do-hanh-chinh',
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
export class MapRoutingModule {}
