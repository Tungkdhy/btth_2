import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-device-endpoint-modal',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent {

  @Input() item: any;
  @Input() type: any;

  constructor(
    private readonly supabase: SupabaseService
  ) {
  }

  ngOnInit(){
  }
}
