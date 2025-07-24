import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagerPasswordComponent } from '../../../modules/user-manager/components/user-manager-details/user-manager-password/user-manager-password.component';
import { UserManagerRoleComponent } from '../../../modules/user-manager/components/user-manager-details/user-manager-role/user-manager-role.component';
import { UserManagerInfoComponent } from '../../../modules/user-manager/components/user-manager-details/user-manager-info/user-manager-info.component';
import { UserManagerDetailsComponent } from '../../../modules/user-manager/components/user-manager-details/user-manager-details.component';
import { UserManagerCreateComponent } from '../../../modules/user-manager/components/user-manager-create/user-manager-create.component';
import { UserManagerListComponent } from '../../../modules/user-manager/components/user-manager-list/user-manager-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagerListComponent,
  },
  {
    path: 'them-moi',
    component: UserManagerCreateComponent,
  },
  {
    path: ':userId',
    component: UserManagerDetailsComponent,
    children: [
      {
        path: 'chi-tiet',
        component: UserManagerInfoComponent,
      },
      {
        path: 'mat-khau',
        component: UserManagerPasswordComponent,
      },
      {
        path: 'phan-quyen',
        component: UserManagerRoleComponent,
      },
      {
        path: '',
        redirectTo: 'chi-tiet',
        pathMatch: 'full',
      },
      {
        path: '*',
        redirectTo: 'chi-tiet',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '*',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagerRoutingModule {}
