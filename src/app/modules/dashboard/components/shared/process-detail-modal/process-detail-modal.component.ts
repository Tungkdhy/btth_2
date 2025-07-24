import { ChangeDetectorRef, Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';

@Component({
  selector: 'app-process-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgbPaginationModule,
],
  templateUrl: './process-detail-modal.component.html',
  styleUrls: ['./process-detail-modal.component.scss'],
})
export class ProcessDetailModalComponent implements OnInit {

  page:any = 1;
  pageSize:any = 10;
  total =0;
  public dataSource: any[]=[];

  constructor(
    private supabase: SupabaseService,
    private convertService:ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) {}
  @Input() id: string;
  @Input() sys: string;
  @Input() startDate: string;
  @Input() endDate: string;
  async ngOnInit() {
    let list:any = await this.supabase.ptm_chi_tiet_khacfuc(this.id,this.sys,this.startDate,this.endDate);
    this.dataSource = list?.items;
    this.page = list?.page_index;
    this.pageSize = list?.page_size;
    this.total = list?.total;
  };
  async onPageChange(page: number) {
    this.page = page;
    let list:any = await this.supabase.ptm_chi_tiet_khacfuc(this.id,this.sys,this.startDate,this.endDate);
    this.dataSource = list?.items;
    this.page = list?.page_index;
    this.pageSize = list?.page_size;
    this.total = list?.total;

  }
  getRegionType(region: string) {
    return this.convertService.getName(region);
  }
  public modal = inject(NgbActiveModal);
}
