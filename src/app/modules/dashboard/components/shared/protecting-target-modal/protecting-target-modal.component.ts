import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProtectingTargetInformationComponent } from '../protecting-target-information/protecting-target-information.component';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { BrowserModule } from '@angular/platform-browser';
import { ProtectingTargetNegativeManagementComponent } from '../protecting-target-negative-management/protecting-target-negative-management.component';
import { SupabaseProtectingTargetService } from './services/supabase.service';
import { BocgoInforComponent } from '../bocgo-infor/bocgo-infor.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-protecting-target-modal',
  templateUrl: './protecting-target-modal.component.html',
  imports: [
    ProtectingTargetInformationComponent,
    ProtectingTargetNegativeManagementComponent,
    TabModule,
    BocgoInforComponent,
    CommonModule,
  ],
  styleUrls: ['./protecting-target-modal.component.scss'],
  standalone: true,
})
export class ProtectingTargetModalComponent implements OnInit, OnChanges {
  @Input() id!: string;
  @Input() selectedStartDate!: any;
  @Input() selectedEndDate!: any;
  @Input() selectedSystem: string;

  public inforLeftData: any;
  public donutChartData: any;
  public columnChartData: any;

  private supabaseService = inject(SupabaseProtectingTargetService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {}

  async ngOnInit(): Promise<any> {
    // Du lieu left column
    await this.updateInforData();
  }

  async updateInforData() {
    this.inforLeftData = await this.supabaseService
      .tctt_thong_tin_muc_tieu_bao_ve(this.id!)
      .then((data) => {
        return data;
      })
      .finally(() => {
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if any input properties have changed
    if (
      changes['id'] &&
      changes['id'].previousValue !== changes['id'].currentValue
    ) {
      this.updateInforData(); // Update data when inputs change
    }
  }

  public modal = inject(NgbActiveModal);
}
