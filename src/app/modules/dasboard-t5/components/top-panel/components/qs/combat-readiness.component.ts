import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { ApiHeaderService } from 'src/app/modules/dasboard-t5/services/header.service';
@Component({
  selector: 'app-qs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combat-readiness.component.html',
  styleUrls: ['./combat-readiness.component.scss'],
})
export class QSComponent {
  combatReadinessData: any = [
    {
      "loai": "Trực chỉ huy",
      "TM": "D.Minh",
      "C1": "B.Sơn",
      "HCKT": "D.Hội",
      "CumS1": "P.Cường",
      "CumS2": "N.Cường",
      "CumS3": "N.Linh"
    },
    {
      "loai": "Trạng thái SSCD",
      "TM": "TX",
      "C1": "TX",
      "HCKT": "TX",
      "CumS1": "TX",
      "CumS2": "TX",
      "CumS3": "Cao"
    },
    {
      "loai": "Cấp độ xử trí",
      "TM": "",
      "C1": "",
      "HCKT": "",
      "CumS1": "Cấp độ 1",
      "CumS2": "Cấp độ 1",
      "CumS3": "Cấp độ 3"
    }
  ];
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
    private apiHeaderService: ApiHeaderService
  ) { }
  data: any = {};

  ngOnInit() {
    // Dữ liệu bạn đưa
    const body = {
      "p_ngay_kip_truc": "20250131080000"
    }
    this.apiHeaderService.fetchDataTruc(body).subscribe({
      next: (res) => {
        this.data = res[0]
        this.cdr.detectChanges()
      },
      error: (e) => {
        console.log(e);

      }
    })

    
  }
  getStatusClass(value: number): string {
    switch (value) {
      case 1:
        return 'status-green';
      case 2:
        return 'status-yellow';
      case 3:
        return 'status-orange';
      case 4:
        return 'status-red';
      default:
        return '';
    }
  }
  getStatusClassCD(level: string | null): string {
  switch (level) {
    case '1': return 'status-green';
    case '2': return 'status-yellow';
    case '3': return 'status-orange';
    case '4': return 'status-red';
    default: return '';
  }
}
  getDotClass(status: string): string {
    if (!status) return 'dot';
    if (status.includes('Ổn định') || status.includes('Bình thường')) return 'dot green';
    if (status.includes('Cao') || status.includes('Nguy hiểm')) return 'dot red';
    return 'dot';
  }
  getStatusText(value: number, id: number): string {
    if (id === 2 || id === 3) {
      switch (value) {
        case 1:
          return 'Cấp 1';
        case 2:
          return 'Cấp 2';
        case 3:
          return 'Cấp 3';
        case 4:
          return 'Cấp 4';
        default:
          return '';
      }
    } else {
      switch (value) {
        case 1:
          return 'TX';
        case 2:
          return 'Tăng cường';
        case 3:
          return 'Cao';
        case 4:
          return 'Toàn bộ';
        default:
          return '';
      }
    }
  }
  // async ngOnInit() {
  //   let thongKeDanhSach = await this.supabase.getDanhSachSSCD();
  //   this.combatReadinessData = await thongKeDanhSach?.items;
  //   console.log(thongKeDanhSach);
  //   this.cdr.detectChanges();
  // }
}
