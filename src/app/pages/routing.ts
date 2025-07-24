import { Routes } from '@angular/router';
import { Constant } from '../core/config/constant';
import { AuthGuard } from '../modules/keycloak/services/auth.guard';

const Routing: Routes = [
  // {
  //   path: 'thu-nghiem',
  //   component: TreeGridTestComponent,
  // },
  {
    path: 'he-thong',
    loadChildren: () =>
      import('./system/system.module').then((m) => m.SystemModule),
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
    redirectTo: 'ban-do',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
