import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
@Component({
  selector: 'app-combat-readiness',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combat-readiness.component.html',
  styleUrls: ['./combat-readiness.component.scss'],
})
export class CombatReadinessComponent {
  combatReadinessData: any = [
  {
    "tenMang": "Mạng Quân sự",
    "thietBi": "FMC (1/1), Fidelis (1/1), NAC (1/1)",
    "soLuong": 3
  },
  {
    "tenMang": "Mạng Internet",
    "thietBi": "RedFox (1/6), Platform (1/2), Spyder (1/1), DDI (1/1), Nessus (1/1), Acu...",
    "soLuong": 12
  },
  {
    "tenMang": "Mạng Chuyên dùng",
    "thietBi": "Flowmon (1/1), VCM (1/2)",
    "soLuong": 2
  }
];
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

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
