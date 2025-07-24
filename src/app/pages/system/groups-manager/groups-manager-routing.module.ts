import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  GroupsManagerListComponent
} from "../../../modules/groups-manager/components/groups-manager-list/groups-manager-list.component";
import {
  GroupsManagerCreateComponent
} from "../../../modules/groups-manager/components/groups-manager-create/groups-manager-create.component";
import {
  GroupsManagerDetailsComponent
} from "../../../modules/groups-manager/components/groups-manager-details/groups-manager-details.component";
import {
  GroupsManagerDetailsInfoComponent
} from "../../../modules/groups-manager/components/groups-manager-details/groups-manager-details-info/groups-manager-details-info.component";
import {
  GroupsManagerDetailsChildComponent
} from "../../../modules/groups-manager/components/groups-manager-details/groups-manager-details-child/groups-manager-details-child.component";
import {
  GroupsManagerDetailsUserComponent
} from "../../../modules/groups-manager/components/groups-manager-details/groups-manager-details-user/groups-manager-details-user.component";
import {
  GroupsManagerDetailsMapComponent
} from "../../../modules/groups-manager/components/groups-manager-details/groups-manager-details-map/groups-manager-details-map.component";


const routes: Routes = [
  {
    path: '',
    component: GroupsManagerListComponent,
  },
  {
    path: 'them-moi',
    component: GroupsManagerCreateComponent,
  },
  {
    path: ':groupId',
    component: GroupsManagerDetailsComponent,
    children: [
      {
        path: 'chi-tiet',
        component: GroupsManagerDetailsInfoComponent,
      },
      {
        path: 'nhom-con',
        component: GroupsManagerDetailsChildComponent,
      },
      {
        path: 'nguoi-dung',
        component: GroupsManagerDetailsUserComponent,
      },
      {
        path: 'ban-do',
        component: GroupsManagerDetailsMapComponent,
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
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '*',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class GroupsManagerRoutingModule {}
