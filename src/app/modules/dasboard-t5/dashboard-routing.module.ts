import { RouterModule, Routes } from '@angular/router';
// import { LeftPanelComponent } from './components/left-panel/left-panel.component';
// import { MidPanelComponent } from './components/mid-panel/mid-panel.component';
// import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
// import { TopPanelComponent } from './components/top-panel/top-panel.component';
// import { ModeToggleComponent } from '../mode-toggle/mode-toggle.component';
// import { DetailPanelComponent } from './components/mid-panel/detail-panel/detail-panel.component';
// import { MilitaryMapComponent } from './components/mid-panel/military-map/military-map.component';
// import { NodeCoordinateManagerComponent } from './components/shared/node-coordinate-manager/node-coordinate-manager.component';
// import { BlinkBlinkChanelComponent } from '../blink-blink-chanel/blink-blink-chanel.component';
// import { LoginNewComponent } from './components/login/login-new.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    // canActivate: [AuthGuard],
  },
  // {
  //   path: 'top-panel',
  //   component: TopPanelComponent,
  //   // canActivate: [AuthGuard],
  // },
  // {
  //   path: 'left-panel',
  //   component: LeftPanelComponent,
  //   // canActivate: [AuthGuard],
  // },
  // {
  //   path: 'detail-panel',
  //   component: DetailPanelComponent,
  // },
  // {
  //   path: 'mid-panel',
  //   component: MidPanelComponent,
  //   // canActivate: [AuthGuard],
  // },
  // {
  //   path: 'right-panel',
  //   component: RightPanelComponent,
  //   // canActivate: [AuthGuard],
  // },
  // {
  //   path: 'topology',
  //   component: NodeCoordinateManagerComponent,
  // },
  // {
  //   path: 'map',
  //   component: MilitaryMapComponent,
  // },
  // {
  //   path: 'change-themes',
  //   component: ModeToggleComponent,
  // },
  // {
  //   path: 'panel-select',
  //   component: BlinkBlinkChanelComponent,
  // },
  // {
  //   path: 'login',
  //   component: LoginNewComponent,
  // },
  // { path: '', redirectTo: '', pathMatch: 'full' },
  // { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
