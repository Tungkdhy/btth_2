import { NgModule } from '@angular/core';
import { UnitComponent } from './unit.component';
import { RouterModule, Routes } from '@angular/router';
import { EditUnitComponent } from './edit-unit/edit-unit.component';
import { FormUnitComponent } from '../../../modules/unit/components/form-unit/form-unit.component';
import { UnitOrganizationComponent } from '../../../modules/unit/components/unit-organization/unit-organization.component';
import { ReferenceComponent } from '../../../modules/reference/components/main/reference.component';
import { UnitTopologyComponent } from '../../../modules/unit/components/unit-topology/unit-topology.component';
import { CoordinateDigitalMapComponent } from '../../../modules/unit/components/coordinate-digital-map/coordinate-digital-map.component';
import { ReferenceUnitComponent } from '../../../modules/reference/components/reference-unit/reference-unit.component';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { NgForOf } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: UnitComponent,
  },
  {
    path: ':id',
    component: EditUnitComponent,

    children: [
      {
        path: '',
        redirectTo: 'chi-tiet',
        pathMatch: 'full',
      },
      {
        path: 'chi-tiet',
        component: FormUnitComponent,
        data: { action: 'edit' },
      },
      // {
      //   path: 'anh-xa',
      //   component: ReferenceComponent,
      //   data: { action: 'referenceUnit' },
      // },
      {
        path: 'anh-xa',
        component: ReferenceUnitComponent,
        data: { action: 'referenceUnit' },
      },
      {
        path: 'so-do-mang',
        component: UnitTopologyComponent,
      },
      {
        path: 'ban-do-so',
        component: CoordinateDigitalMapComponent,
        data: { action: 'digitalMapUnit' },
      },
    ],
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TreeGridModule, NgForOf],
})
export class UnitModule {}
