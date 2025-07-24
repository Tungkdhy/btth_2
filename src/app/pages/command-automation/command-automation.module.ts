import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandAutomationComponent } from '../../modules/endpoint/components/command-automation/command-automation.component';
import { ComputerRouting } from '../management-device/computer/computer-routing';
import { AuthGuard } from '../../modules/keycloak/services/auth.guard';
import { Constant } from '../../core/config/constant';
import { DynamicDefinitionComponent } from '../../modules/endpoint/components/command-automation/dynamic-definition/dynamic-definition.component';
import { ViolatedEndpointsComponent } from '../../modules/endpoint/components/command-automation/violated-endpoints/violated-endpoints.component';
import { ActionLogsComponent } from '../../modules/endpoint/components/command-automation/action-logs/action-logs.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: CommandAutomationComponent,
  // },
  {
    path: 'dinh-nghia-dong',
    component: DynamicDefinitionComponent,
  },
  {
    path: 'thiet-bi-vi-pham',
    component: ViolatedEndpointsComponent,
  },
  {
    path: 'nhat-ky-hoat-dong',
    component: ActionLogsComponent,
  },
  {
    path: '',
    redirectTo: 'dinh-nghia-dong',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class CommandAutomationModule {}
