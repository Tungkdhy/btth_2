import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  inject,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../services/supabase.service';
import {
  GridModule,
  EditService,
  ToolbarService,
  PageService,
} from '@syncfusion/ej2-angular-grids';
import { ChartModule, SeriesModel } from '@syncfusion/ej2-angular-charts';
import {
  TabAllModule,
  TreeViewComponent,
  TreeViewModule,
} from '@syncfusion/ej2-angular-navigations';
import {
  formatDatePosition,
  formatNumberWithDot,
  getDateRangePayload,
  isNaNDateFormat,
  isNullStringData,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { filter, Observable, Subject, tap } from 'rxjs';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { selectDateV2 } from 'src/app/store/date-time-range-v2/date-time-range-v2.selectors';
import { Store } from '@ngrx/store';
import { identityMatrix } from '@syncfusion/ej2-angular-diagrams';
import { BreadcrumLeftRightComponent } from "../../../shared/breadcrum-left-right/breadcrum-left-right.component";

@Component({
  selector: 'app-tctt-popup-chudenong',
  templateUrl: './tctt-popup-chudenong.component.html',
  styleUrls: ['./tctt-popup-chudenong.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeViewModule,
    GridModule,
    ChartModule,
    TabAllModule,
    NgbPaginationModule,
    NgbModule,
    BreadcrumLeftRightComponent
],
  providers: [EditService, ToolbarService, PageService],
})
export class TcttPopupChudenongComponent implements OnInit, OnChanges {
  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  @Input() dataDetail: any;
  @Input() treeList: any[] = [];
  @Input() diemtin: any[] = [];

  public treeData: any[] = [];
  public treeData1: Object[] = [];
  public detailTopic: any[] = [];
  public detailNegativeTopic: any[] = [];
  public diemTinTopic: any[] = [];
  public selectedDiemTin: string;
  public diemTinDetailsTree: Object[] = [];
  public totalTinBai: number = 0;
  public totalTieuCuc: number = 0;
  public totalTuongTac: number = 0;
  public selectedStart: string | Date;
  public selectedEnd: string | Date;
  public selectedFullStart: string | Date;
  public selectedFullEnd: string | Date;
  public filteredData1: any[] = [];
  public anhDetailTopic: any[] = [];
  public suViecDangChuY: any[] = [];
  public searchText: string = '';
  selectedTree: 'chude' | 'diemtin' = 'chude';
  page: number = 1;
  pageTieuCuc: number = 1;
  pageDiemTin: number = 1;
  pageSize: number = 10;

  public dateRange: Object = {};
  public gridData: any[] = [];
  public originalGridData: any[] = [];
  public selectedNode: any;
  public pageSettings = {};
  public chartSeries: SeriesModel[];
  private cdr = inject(ChangeDetectorRef);
  private supabaseService = inject(SupabaseService);

  selectedChude: string = '';

  public originalGridData2: any[] = [];
  public filteredData: any[] = [];

  date$: Observable<any>;

  @ViewChild('chuDeTreeview') chuDeTreeview!: TreeViewComponent;
  @ViewChild('diemTinTreeview') diemTinTreeview!: TreeViewComponent;

  // Mock data
  mockSidebarData: any = [
    {
      id: 1,
      name: 'Chính trị - Xã hội',
      children: [
        {
          id: 11,
          name: 'Đảng - Nhà nước',
          children: [
            {
              id: 111,
              name: 'Tin Đảng',
              children: []
            },
            {
              id: 112,
              name: 'Tin Nhà nước',
              children: []
            }
          ]
        },
        {
          id: 12,
          name: 'Quốc phòng - An ninh',
          children: []
        }
      ]
    },
    {
      id: 2,
      name: 'Kinh tế - Tài chính',
      children: [
        {
          id: 21,
          name: 'Ngân hàng',
          children: []
        },
        {
          id: 22,
          name: 'Bất động sản',
          children: []
        }
      ]
    },
    {
      id: 3,
      name: 'Giáo dục - Y tế',
      children: []
    }
  ];

  constructor(private store: Store) {}

  async ngOnInit() {
    this.date$ = this.store.select(selectDateV2).pipe(
      filter((date) => !!(date && date.startDate && date.endDate)),
      tap((date) => {
        // DO sth
        const { startDate, endDate } = getDateRangePayload(
          date.startDate!,
          date.endDate!,
          '0',
        );
        this.selectedStart = startDate;
        this.selectedEnd = endDate;
        this.selectedFullStart = date.startDate!;
        this.selectedFullEnd = date.endDate!;
        if (!isNaNDateFormat(startDate, endDate)) {
          if (this.treeData[0]?.id) {
            this.updateData(this.treeData[0]!.id);
          }
        }
      }),
    );

    this.page = 1;
    this.pageSize = 10;

    this.treeData = this.buildTree(this.treeList);    
    this.treeData1 = this.buildTree(this.diemtin);
    this.gridData = [...this.originalGridData];
    this.filteredData = [...this.originalGridData2];

    this.cdr.markForCheck();
  }

  get filteredDetailTopicData(): any {
    return this.detailTopic.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize,
    );
  }

  get filteredDiemTinData(): any {
    return this.diemTinTopic.slice(
      (this.pageDiemTin - 1) * this.pageSize,
      this.pageDiemTin * this.pageSize,
    );
  }

  get filteredDetailTieuCucData(): any {
    const searchLower = this.searchText.toLowerCase();
    return this.detailNegativeTopic
      .filter(
        (item) =>
          item?.chude?.toLowerCase().includes(searchLower) ||
          item?.thongtintieucuc?.toLowerCase().includes(searchLower) ||
          item?.duongdan?.toLowerCase().includes(searchLower) ||
          item?.doituong?.toLowerCase().includes(searchLower) ||
          item?.ngaydangtai?.toLowerCase().includes(searchLower) ||
          item?.ngayphathien?.toLowerCase().includes(searchLower) ||
          item?.nentang?.toLowerCase().includes(searchLower) ||
          item?.tuongtac?.toString().includes(searchLower),
      )
      .slice(
        (this.pageTieuCuc - 1) * this.pageSize,
        this.pageTieuCuc * this.pageSize,
      );
  }

  ngOnChanges(changes: SimpleChanges): void {}

  // xử lý sự kiện đóng popup từ component con tới component cha
  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }

  updateData(id: string): void {
    if (this.selectedStart === this.selectedEnd) {
      this.page = 1;
      this.supabaseService
        .tctt_chi_tiet_chu_de(id, this.selectedFullStart, this.selectedFullEnd)
        // chi tiết tương quan mục tiêu
        .then((data) => {
          this.diemTinDetailsTree = [];
          this.diemTinTopic = [];
          this.detailTopic = data?.map((item: any) => ({
            ...item,
            tongtinbaihomtruoc:
              item.tongtinbaihomtruoc === null
                ? 0
                : item.tongtinbai - item.tongtinbaihomtruoc,
            tongtieucuchomtruoc:
              item.tongtieucuchomtruoc === null
                ? 0
                : item.tongtieucuc - item.tongtieucuchomtruoc,
          }));
        })
        .finally(() => this.cdr.markForCheck());

      this.supabaseService
        .tctt_tin_tieu_cuc_theo_chu_de(id, this.selectedStart, this.selectedEnd)
        // chi tiết tương quan mục tiêu
        .then((data) => {
          this.detailNegativeTopic = data?.map((item: any, idx: any) => {
            return {
              ...item,
              index: idx + 1,
              tuongtac: formatNumberWithDot(item?.tuongtac),
              ngaydangtai: formatDatePosition(item?.ngaydangtai),
              ngayphathien: formatDatePosition(item?.ngayphathien),
            };
          });

          this.cdr.markForCheck();
        })
        .finally(() => this.cdr.markForCheck());

      // Lay thong tin chi tiet ve chu de con
    } else {
      this.page = 1;
      this.pageTieuCuc = 1;
      this.supabaseService
        .tctt_chi_tiet_chu_de_nhieu_ngay(
          id,
          this.selectedStart,
          this.selectedEnd,
        )
        // chi tiết tương quan mục tiêu
        .then((data) => {
          this.diemTinDetailsTree = [];
          this.diemTinTopic = [];

          this.detailTopic = data?.map((item: any, idx: any) => {
            this.totalTinBai += parseInt(item.tongtinbai);
            this.totalTieuCuc += parseInt(item.tongtieucuc);
            this.totalTuongTac += parseInt(item.tongtuongtac);

            return {
              ...item,
              ngay: formatDatePosition(item.ngay),
              note: isNullStringData(item.note)
                ? 'Không có ghi chú'
                : item.note,
              tongtinbai: formatNumberWithDot(item.tongtinbai),
              tongtieucuc: formatNumberWithDot(item.tongtieucuc),
              tongtuongtac: formatNumberWithDot(item.tongtuongtac),
            };
          });
        })
        .finally(() => this.cdr.markForCheck());
        
      this.supabaseService
        .tctt_tin_tieu_cuc_theo_chu_de(id, this.selectedStart, this.selectedEnd)
        // chi tiết tương quan mục tiêu
        .then((data) => {
          this.detailNegativeTopic = data?.map((item: any, idx: any) => {
            return {
              ...item,
              index: idx + 1,
              tuongtac: formatNumberWithDot(item?.tuongtac),
              ngaydangtai: formatDatePosition(item?.ngaydangtai),
              ngayphathien: formatDatePosition(item?.ngayphathien),
            };
          });

          this.cdr.markForCheck();
        })
        .finally(() => this.cdr.markForCheck());
      // Lay thong tin chi tiet ve chu de con
    }
    this.supabaseService
      .tctt_chi_tiet_chu_de_con(id, this.selectedStart, this.selectedEnd)
      .then((data) => {
        this.suViecDangChuY = data?.map((item: any, index: any) => ({
          ...item,
          index: index + 1,
        }));
      })
      .finally(() => this.cdr.markForCheck());
  }

  async fetchDiemTinDataDay(id: string): Promise<void> {
    try {
      // First API call
      this.anhDetailTopic = [];
      const anhData = await this.supabaseService.tctt_chi_tiet_anh_theo_chu_de(
        id,
        this.selectedEnd,
      );
      this.anhDetailTopic = anhData.map((item: any, idx: string) => ({
        ...item,
        image_id: `image_${idx}`,
      }));
      this.cdr.markForCheck();

      const diemTinData = await this.supabaseService.tctt_chi_tiet_diem_tin(
        id,
        this.selectedEnd,
      );
      this.diemTinTopic = diemTinData;      
      this.diemTinDetailsTree = this.buildTree(
        diemTinData?.map((item: any) => {
          if (this.anhDetailTopic && this.anhDetailTopic.length > 0) {
            const _foundIndex = this.anhDetailTopic.findIndex(
              (idx: any) => idx.image_name === item.noidung,
            );

            if (_foundIndex != -1) {
              return {
                ...item,
                picture: this.anhDetailTopic[_foundIndex].image_data.image,
                id: isNullStringData(item.id)
                  ? `key_${Math.floor(Math.random() * 1000)}`
                  : item.id,
              };
            }
          }

          return {
            ...item,
            id: isNullStringData(item.id)
              ? `key_${Math.floor(Math.random() * 1000)}`
              : item.id,
          };
        }),
      );
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.cdr.markForCheck();
    }
  }

  fetchDiemTinDataWeek(id: string): void {
    this.pageDiemTin = 1;

    this.supabaseService
      .tctt_chi_tiet_diem_tin_nhieu_ngay(
        id,
        this.selectedStart,
        this.selectedEnd,
      )
      .then((data) => {
        this.detailTopic = [];

        this.diemTinTopic = data?.map((item: any) => ({
          ...item,
          ngay: formatDatePosition(item.ngay),
        }));        
        this.cdr.markForCheck();
      })
      .finally(() => this.cdr.markForCheck());
  }

  buildTree(list: any[]): any[] {
    let temp: { [key: string]: any } = {};
    let tree: any[] = [];

    // Xử lý các nodes trong list để thêm vào temp

    for (let item of list) {
      if (!temp[item.id]) {
        temp[item.id] = {
          ...item,
          expanded: true,
          children: [],
        };
      }
    }

    // Xây dựng cây
    for (let item of list) {
      if (item.id_cha && temp[item.id_cha]) {
        temp[item.id_cha].children!.push(temp[item.id]);
      } else {
        // Nếu không có parent, thêm vào tree (làm node gốc)
        tree.push(temp[item.id]);
      }
    }

    return tree;
  }

  onNodeSelected(event: any): void {
    this.clearActiveState(this.diemTinTreeview);
    this.totalTinBai = 0;
    this.totalTieuCuc = 0;
    this.totalTuongTac = 0;
    this.selectedTree = 'chude';
    const selectedNodeId = event.nodeData.id;
    this.selectedChude = selectedNodeId;
    if (isNullStringData(selectedNodeId)) {
    } else {
      this.updateData(selectedNodeId);
    }
  }

  onNodeDiemTinSelected(event: any): void {
    //this.clearActiveState(this.chuDeTreeview);
    this.totalTinBai = 0;
    this.totalTieuCuc = 0;
    this.totalTuongTac = 0;
    this.detailTopic = [];
    this.selectedTree = 'diemtin';
    const selectedNodeId = event.nodeData.id;
    this.selectedDiemTin = selectedNodeId;
    if (isNullStringData(selectedNodeId)) {
    } else {
      if (this.selectedStart === this.selectedEnd) {
        this.fetchDiemTinDataDay(selectedNodeId);
      } else {
        this.fetchDiemTinDataWeek(selectedNodeId);
      }
    }
  }

  clearActiveState(treeview: TreeViewComponent): void {
    const treeElement = treeview.element; // Get the root element of the treeview
    const activeNodes = treeElement.querySelectorAll('.e-active'); // Find all active nodes
    activeNodes.forEach((node) => {
      node.classList.remove('e-active'); // Remove the active class
    });
  }

  convertData(text: string): string {
    const regex = /(?<=\s)(?=\([ivxlc]+\))/g;
    const newText = text.replace(regex, '\n');
    return newText;
  }

  onPageChange(page: number) {
    this.page === page;
  }

  onPageTieuCucChange(page: number) {
    this.pageTieuCuc === page;
  }

  onPageDiemTinChange(page: number) {
    this.pageDiemTin === page;
  }

  formatNumberWithDotLocal(num: number | string | number[]): string {
    if (!num) return '';
    if (Array.isArray(num)) {
      return num
        .map((item) => item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        .join(' - ');
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  getTruncatedText(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords
      ? words.slice(0, maxWords).join(' ') + '...'
      : text;
  }
  
  isTextTruncated(text: string, maxWords: number): boolean {
    return text.split(' ').length > maxWords;
  }
}
