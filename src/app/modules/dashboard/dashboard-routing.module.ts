import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// import { BlinkBlinkChanelComponent } from '../blink-blink-chanel/blink-blink-chanel.component';
import { LoginNewComponent } from './components/login/login-new.component';
import { DashboardComponent as DashboardComponentT5 } from '../dasboard-t5/dashboard.component';


// import { RightPanelT5Component } from '../right-panel/right-panel/right-panel.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponentT5,
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
  //   path: 't5/right-panel',
  //   component: RightPanelT5Component,
  // },
  // {
  //   path: 't5/left-panel',
  //   component: LeftPanelT5Component,
  // },
  // {
  //   path: 'map',
  //   component: MilitaryMapComponent,
  // },
  // {
  //   path: 't5/map',
  //   component: MidPanelT5Component,
  // },
  // {
  //   path: 'change-themes',
  //   component: ModeToggleComponent,
  // },
  // {
  //   path: 'panel-select',
  //   component: BlinkBlinkChanelComponent,
  // },
  {
    path: 't5',
    component: DashboardComponentT5,
  },
  {
    path: 'login',
    component: LoginNewComponent,
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
