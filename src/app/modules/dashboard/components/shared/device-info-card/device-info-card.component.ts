import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { convertToDateFormatVI } from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseService } from '../../../services/supabase.service';
import { ConvertServiceComponent } from '../../../services/convert-service.component';

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
  selector: 'app-device-info-card',
  standalone: true,
  imports: [CommonModule],
templateUrl: './device-info-card.component.html',
  styleUrls: ['./device-info-card.component.scss'],
})
export class DeviceInfoCardComponent implements OnInit {

  // @Input() device: DeviceInfo = {
  //   name: 'Router-1234',
  //   type: 'Router',
  //   serialNumber: 'SN1234567890',
  //   managementIp: '192.168.1.1',
  //   status: true,
  //   unitId: 'Unit-001',
  //   managerName: 'John Doe',
  //   orderDate: new Date('2023-03-15'),
  //   description: 'Main router for the office network.',
  //   building: 'Main Office',
  //   floor: '2',
  //   room: '201',
  //   systemHealthCpu: '75%',
  //   systemHealthMemory: '65%',
  //   systemHealthTemperatures: '55°C',
  //   lastAuthentication: Date.now(), // Current timestamp
  // };

  device:any;
  @Input() serial_number:any;

  protected readonly convertToDateFormatVI = convertToDateFormatVI;

  constructor(
    private readonly supabaseService:SupabaseService,
    private readonly convertServiceComponent:ConvertServiceComponent
  ){
  }
  async ngOnInit() {
    this.device = await this.supabaseService.getDetailTBMangBySerialNumber(this.serial_number);
  }
  getValueNetwork(name: any) {
    return this.convertServiceComponent.getTypeNetwork(name);
  }
  getTypeRegion(type: string) {
    return this.convertServiceComponent.getName(type);
  }

}
