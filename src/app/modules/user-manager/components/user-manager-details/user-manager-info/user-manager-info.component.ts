import { Component } from '@angular/core';
import {UserManagerFormComponent} from "../../user-manager-form/user-manager-form.component";

@Component({
  selector: 'app-user-manager-info',
  templateUrl: './user-manager-info.component.html',
  styleUrls: ['./user-manager-info.component.scss'],
  imports: [
    UserManagerFormComponent
  ],
  standalone: true
})
export class UserManagerInfoComponent {

}
