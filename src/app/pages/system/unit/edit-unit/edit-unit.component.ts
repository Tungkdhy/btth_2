import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { FormUnitComponent } from '../../../../modules/unit/components/form-unit/form-unit.component';
import { MatTabsModule } from '@angular/material/tabs';
import { UnitOrganizationComponent } from '../../../../modules/unit/components/unit-organization/unit-organization.component';
import { ReferenceComponent } from '../../../../modules/reference/components/main/reference.component';
import { UnitTopologyComponent } from '../../../../modules/unit/components/unit-topology/unit-topology.component';
import { KeycloakService } from 'keycloak-angular';
import { Constant } from '../../../../core/config/constant';

@Component({
  selector: 'app-edit-unit',
  standalone: true,
  imports: [
    CommonModule,
    FormUnitComponent,
    MatTabsModule,
    UnitOrganizationComponent,
    ReferenceComponent,
    UnitTopologyComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './edit-unit.component.html',
  styles: [],
})
export class EditUnitComponent implements OnInit {
  @Output() handleReloadData = new EventEmitter();

  public field: any;

  public router: Router = inject(Router);
  public route: ActivatedRoute = inject(ActivatedRoute);
  private keycloak = inject(KeycloakService);

  constructor() {}

  ngOnInit(): void {
    if (this.keycloak.isUserInRole(Constant.REALM_ROLES.VIEWER)) {
      this.router.navigate(['so-do-mang'], { relativeTo: this.route });
    }
  }

  public back(): void {
    this.router.navigate(['.'], { relativeTo: this.route.parent }).then();
  }

  hasRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }
}
