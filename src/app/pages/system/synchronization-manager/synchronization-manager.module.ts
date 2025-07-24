import { NgModule } from '@angular/core';
import {SynchronizationManagerComponent} from "./synchronization-manager.component";
import {RouterModule, Routes} from "@angular/router";
import {
  FormSynchronizationManagerComponent
} from "../../../modules/synchronization-manager/components/form-synchronization-manager/form-synchronization-manager.component";

const routes: Routes = [
  {
    path: '',
    component: SynchronizationManagerComponent,
  },
  {
    path: 'them-moi',
    component: FormSynchronizationManagerComponent,
  },
  {
    path: 'chinh-sua',
    component: FormSynchronizationManagerComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class SynchronizationManagerModule { }
