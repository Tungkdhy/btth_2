import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../data-table/data-table.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-device-port-list-card',
  standalone: true,
  imports: [CommonModule, DataTableComponent,NgbPaginationModule],
  templateUrl: './device-port-list-card.component.html',
  styleUrls: ['./device-port-list-card.component.scss'],
})
export class DevicePortListCardComponent implements OnInit {

  @Input() serial_number:any;

  dataSource:any[]=[];
  page = 1;
  pageSize = 5;
  total =0;

  constructor(
    private cdr: ChangeDetectorRef,
    private supabaseService: SupabaseService
  ){

  }

  async ngOnInit() {
    let data:any = await this.supabaseService.getDetailTBPortMangBySerialNumber(this.serial_number);
    this.dataSource = data?.items;
    this.total = data?.total;
    this.cdr.detectChanges();
  }

  async ngOnChanges(changes: SimpleChanges) {
    let data:any = await this.supabaseService.getDetailTBPortMangBySerialNumber(this.serial_number);
    this.dataSource = data?.items;
    this.total = data?.total;
    this.cdr.detectChanges();
  };

  async onPageChange(page: number) {
    this.page = page;
    let data:any = await this.supabaseService.getDetailTBPortMangBySerialNumber(this.serial_number,page,this.pageSize);
    this.dataSource = data?.items;
    this.total = data?.total;
    this.cdr.detectChanges();

  }
}
