import { NgModule } from '@angular/core';
import {MonitoringSystemComponent} from "./monitoring-system.component";
import {RouterModule} from "@angular/router";

const route = [
  {
    path: '',
    component: MonitoringSystemComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(route),
  ]
})
export class MonitoringSystemModule { }
