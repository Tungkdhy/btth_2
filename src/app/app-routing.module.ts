import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { DashboardComponent } from './modules/dashboard/dashboard.component';

export const routes: Routes = [
  // {
  //   path: 'xac-thuc',
  //   loadChildren: () =>
  //     import('./modules/auth/auth.module').then((m) => m.AuthModule),
  // },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  // {
  //   path: '',
  //   component: DashboardComponent
  // },
  {
    path: '',
    loadChildren: () =>
      import('./modules/dashboard/dashboard-routing.module').then(
        (m) => m.DashboardRoutingModule,
      ),
  },
  // {
  //   path: 't5',
  //   loadChildren: () =>
  //     import('./modules/dasboard-t5/dashboard-routing.module').then(
  //       (m) => m.DashboardRoutingModule,
  //     ),
  // },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
