import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UserManagerFormComponent} from "../user-manager-form/user-manager-form.component";

@Component({
  selector: 'app-user-manager-create',
  templateUrl: './user-manager-create.component.html',
  styleUrls: ['./user-manager-create.component.scss'],
  imports: [
    UserManagerFormComponent
  ],
  standalone: true
})
export class UserManagerCreateComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  onClose() {
    this.router.navigate(['../'], { relativeTo: this.route }).then();
  }
}
