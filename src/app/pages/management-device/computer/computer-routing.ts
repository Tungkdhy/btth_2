import { Routes } from '@angular/router';
import { MainComputerComponent } from '../../../modules/endpoint/components/main-computer/main-computer.component';
import { Constant } from '../../../core/config/constant';
import { MainFormComputerComponent } from '../../../modules/endpoint/components/main-form-computer/main-form-computer.component';
import { MainEditComputerComponent } from '../../../modules/endpoint/components/main-edit-computer/main-edit-computer.component';
import { AuthGuard } from '../../../modules/keycloak/services/auth.guard';

const ComputerRouting: Routes = [
  {
    path: '',
    component: MainComputerComponent,
  },
  {
    path: 'them-moi',
    component: MainFormComputerComponent,
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
  },
  {
    path: 'chinh-sua/:mac',
    component: MainEditComputerComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
      readonly: false,
    },
  },
  {
    path: 'chi-tiet/:mac',
    component: MainEditComputerComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
      readonly: true,
    },
  },
];

export { ComputerRouting };
