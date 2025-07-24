import { Component } from '@angular/core';
import { SupabaseService } from '../../../services/supabase.service';
import { Router } from '@angular/router';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: true,
  imports : [ButtonModule, CommonModule]
})
export class AvatarComponent {
  showDropdown: boolean = false;

  constructor(private router: Router, private supabase: SupabaseService) {}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.showDropdown = false;
    this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}
