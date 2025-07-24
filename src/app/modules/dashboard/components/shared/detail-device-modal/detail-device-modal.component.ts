import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceInfoCardComponent } from '../device-info-card/device-info-card.component';
import { DevicePortListCardComponent } from '../device-port-list-card/device-port-list-card.component';
import { EndpointListCardComponent } from '../endpoint-list-card/endpoint-list-card.component';
import { ViolatedEndpointListCardComponent } from '../violated-endpoint-list-card/violated-endpoint-list-card.component';
import { DeviceComputerListCardComponent } from '../device-computer-list-card/device-computer-list-card.component';
import { CleanedMalwareListCardComponent } from '../cleaned-malware-list-card/cleaned-malware-list-card.component';
import { UncleanedMalwareListCardComponent } from '../uncleaned-malware-list-card/uncleaned-malware-list-card.component';
import { InfoClientServerComponent } from '../client-server-component-modal/info-client-server-card/info-client-server.component';
import { ConfigurationCardComponent } from '../client-server-component-modal/configuration-card/configuration-card.component';
import { ApplicationCardComponent } from '../client-server-component-modal/application-card/application-card.component';
import { UncleanedMalwareClientServerListCardComponent } from '../client-server-component-modal/uncleaned-malware-list-card/uncleaned-malware-list-card.component';
import { CleanedMalwareClientServerListCardComponent } from '../client-server-component-modal/cleaned-malware-list-card/cleaned-malware-list-card.component';

@Component({
  selector: 'app-detail-device-modal',
  standalone: true,
  imports: [
    CommonModule,
    DeviceInfoCardComponent,
    DevicePortListCardComponent,
    EndpointListCardComponent,
    ViolatedEndpointListCardComponent,
    DeviceComputerListCardComponent,
    CleanedMalwareListCardComponent,
    UncleanedMalwareListCardComponent,
    InfoClientServerComponent,
    ConfigurationCardComponent,
    ApplicationCardComponent,
    UncleanedMalwareClientServerListCardComponent,
    CleanedMalwareClientServerListCardComponent,
  ],
  templateUrl: './detail-device-modal.component.html',
  styleUrls: ['./detail-device-modal.component.scss'],
})
export class DetailDeviceModalComponent implements OnInit {
  @Input() serialNumber: string;
  @Input() mainType: string;
  @Input() subType: string;
  @Input() regionType: string;

  @Input() startDate: string;
  @Input() endDate: string;

  @Input() type: string;
  @Input() source: string;
  @Input() isClickTrongNgay: boolean;
  device: any;
  portList: any;

  async ngOnInit() {}

  public modal = inject(NgbActiveModal);
}
