import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-user-manager-details',
  templateUrl: './user-manager-details.component.html',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  styleUrls: ['./user-manager-details.component.scss'],
})
export class UserManagerDetailsComponent {}
