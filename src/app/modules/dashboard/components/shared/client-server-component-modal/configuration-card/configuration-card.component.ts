import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { NumberFormatPipe } from "../../../../../../core/pipes/number-format/number-format.pipe";

@Component({
  selector: 'app-configuration-card',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, NumberFormatPipe],
  templateUrl: './configuration-card.component.html',
  styleUrls: ['./configuration-card.component.scss'],
})
export class ConfigurationCardComponent implements OnInit {

  device:any;
  @Input() serial_number:any;


  constructor(
    private readonly supabaseService:SupabaseService,
    private readonly convertServiceComponent:ConvertServiceComponent
  ){
  }
  async ngOnInit() {
    this.device = await this.supabaseService.getDetailClientServer(this.serial_number);
  }
  getValueNetwork(name: any) {
    return this.convertServiceComponent.getTypeNetwork(name);
  }
  getTypeRegion(type: string) {
    return this.convertServiceComponent.getName(type);
  }
  formatKBtoGB(value: number) {
    return Math.floor(value/(1024*1024)) || '';
  }
  formatMBtoGB(value: number) {
    return Math.floor(value/(1024)) || '';
  }
}
