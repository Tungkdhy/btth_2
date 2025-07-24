import { Routes } from '@angular/router';
import { MainNetworkDeviceComponent } from '../../../modules/device/components/main-network-device/main-network-device.component';
import { Constant } from '../../../core/config/constant';
import { MainFormNetworkDeviceComponent } from '../../../modules/device/components/main-form-network-device/main-form-network-device.component';
import { AuthGuard } from '../../../modules/keycloak/services/auth.guard';
import { MainEditNetworkDeviceComponent } from '../../../modules/device/components/main-edit-network-device/main-edit-network-device.component';

const NetworkDeviceRouting: Routes = [
  {
    path: '',
    component: MainNetworkDeviceComponent,
  },
  {
    path: 'them-moi',
    component: MainFormNetworkDeviceComponent,
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'chinh-sua/:serialNumber',
    component: MainEditNetworkDeviceComponent,
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
      readonly: false,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'chi-tiet/:serialNumber',
    component: MainEditNetworkDeviceComponent,
    data: {
      roles: [
        Constant.REALM_ROLES.MANAGER,
        Constant.REALM_ROLES.VIEWER,
        Constant.REALM_ROLES.CENTRAL_COMMITTEE_MANAGER,
      ],
      readonly: true,
    },
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export { NetworkDeviceRouting };
