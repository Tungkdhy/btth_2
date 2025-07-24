import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { convertToDateFormatVI } from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';

interface DeviceInfo {
  name: string;
  type?: string; // Optional since it depends on typeDevice
  serialNumber?: string;
  managementIp: string;
  status: boolean;
  unitId: string;
  managerName?: string;
  orderDate?: Date;
  description?: string;
  building: string;
  floor: string;
  room: string;
  systemHealthCpu?: string;
  systemHealthMemory?: string;
  systemHealthTemperatures?: string;
  lastAuthentication?: number;
}

@Component({
  selector: 'app-info-client-server-card',
  standalone: true,
  imports: [CommonModule],
templateUrl: './info-client-server.component.html',
  styleUrls: ['./info-client-server.component.scss'],
})
export class InfoClientServerComponent implements OnInit {


  device:any;
  @Input() serial_number:any;

  protected readonly convertToDateFormatVI = convertToDateFormatVI;

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


}
