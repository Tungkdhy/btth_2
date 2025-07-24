import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { SupabaseProtectingTargetService } from '../protecting-target-modal/services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EditService,
  GridModule,
  PageService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { formatNumberWithDot } from 'src/app/_metronic/layout/core/common/common-utils';

@Component({
  selector: 'app-bocgo-infor',
  templateUrl: './bocgo-infor.component.html',
  styleUrls: ['./bocgo-infor.component.scss'],
  imports: [CommonModule, FormsModule, GridModule, NgbPaginationModule],
  providers: [EditService, ToolbarService, PageService],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class BocgoInforComponent implements OnInit, OnChanges {
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() id!: string;

  public tableData: any[] = [];
  public searchText: string = '';
  public totalData: number = 0;
  public selectedDateOption: string = '-1';
  public dateOptions = [
    { value: '-1', label: '7 ngày gần nhất' },
    { value: '0', label: '30 ngày gần nhất' },
    { value: '1', label: 'Theo ngày' },
    { value: '2', label: 'Theo tuần' },
    { value: '3', label: 'Theo tháng' },
    { value: '4', label: 'Theo năm' },
  ];
  page: number = 1;
  pageSize: number = 10;

  private supabaseService = inject(SupabaseProtectingTargetService);
  private cdr = inject(ChangeDetectorRef);

  get filteredData(): any {
    const searchLower = this.searchText.toString().toLowerCase();
    return this.tableData
      ?.filter(
        (item) =>
          item?.duongdan?.toString().toLowerCase().includes(searchLower) ||
          item?.noidung_vipham
            ?.toString()
            .toLowerCase()
            .includes(searchLower) ||
          item?.trangthai?.toString().toLowerCase().includes(searchLower) ||
          item?.tuongtac?.toString().toLowerCase().includes(searchLower) ||
          item?.nentang?.toString().toLowerCase().includes(searchLower) ||
          item?.donvixuly?.toString().toLowerCase().includes(searchLower),
      )
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  async ngOnInit(): Promise<any> {
    await this.updateData();
  }

  async updateData(): Promise<any> {
    this.tableData = await this.supabaseService
      .tctt_boc_go_theo_muc_tieu_bao_ve(this.id, this.selectedDateOption)
      .then((data) => {
        this.cdr.markForCheck();
        this.totalData = data.length;
        return data?.map((item: any, index: any) => ({
          ...item,
          index: index + 1,
          tuongtac: item?.tuongtac ? formatNumberWithDot(item?.tuongtac) : '0',
        }));
      })
      .finally(() => this.cdr.markForCheck());
  }

  onPageChange(page: number) {
    this.page === page;
  }

  onOptionChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedDateOption = selectedValue;
    this.updateData();
  }

  ngOnChanges(changes: SimpleChanges): void {}
}
