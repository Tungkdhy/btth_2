import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import {
  HotSpotInfo,
  HotSpotStatistics,
  NuanceStats,
} from '../models/btth.interface';
import { map } from 'rxjs/operators';
import { HotSpotType } from '../models/btth.type';

@Injectable({
  providedIn: 'root',
})
export class InfoWarfareSupabaseService {
  private supabase = inject(SupabaseService);

  constructor() {}

  getNuanceStats(): Observable<NuanceStats[]> {
    return from(
      this.supabase.callPostgresFunction(
        'tctt_chi_so_sac_thai_theo_tinh',
        {},
        'public',
      ),
    ).pipe(
      map((response: any) => {
        return response.map((data: any) => ({
          id: data.id,
          name: data.tentinh,
          coordinates: JSON.parse(data.toado),
          center: JSON.parse(data.tam),
          totalCount: data.tongtinbai,
          positiveCount: data.tichcuc,
          neutralCount: data.trungtinh,
          negativeCount: data.tieucuc,
        }));
      }),
    );
  }

  getHotSpotInfoData(code: string = '0'): Observable<HotSpotInfo[]> {
    return from(
      this.supabase.callPostgresFunction(
        'tctt_chi_tiet_diem_nong',
        { _code: code },
        'public',
      ),
    ).pipe(
      map((response: any) => {
        return response.map(
          (data: any): HotSpotInfo => ({
            name: data.name,
            address: data.diachi,
            unit: data.donvi,
            longitude: data.vido,
            latitude: data.kinhdo,
            type: this.convertHotSpotType(data.loaidiemnong),
          }),
        );
      }),
    );
  }

  getHotSpotStatsData(): Observable<HotSpotStatistics[]> {
    return from(
      this.supabase.callPostgresFunction(
        'tctt_diem_nong_theo_don_vi',
        {},
        'public',
      ),
    ).pipe(
      map((response: any): HotSpotStatistics[] =>
        this.reduceHotSpotStatistics(response),
      ),
    );
  }

  reduceHotSpotStatistics(data: any): HotSpotStatistics[] {
    return data.reduce((acc: HotSpotStatistics[], item: any) => {
      const existing = acc.find((stat) => stat.unit === item.tendonvi);

      if (existing) {
        switch (item.loaidiemnong) {
          case 'BOT':
            existing.totalBots += item.soluong;
            break;
          case 'Khu công nghiệp':
            existing.totalIndustrialParks += item.soluong;
            break;
          case 'Giáo xứ':
            existing.totalParishes += item.soluong;
            break;
        }
      } else {
        acc.push({
          unit: item.tendonvi,
          longitude: item.vido,
          latitude: item.kinhdo,
          totalBots: item.loaidiemnong === 'BOT' ? item.soluong : 0,
          totalIndustrialParks:
            item.loaidiemnong === 'Khu công nghiệp' ? item.soluong : 0,
          totalParishes: item.loaidiemnong === 'Giáo xứ' ? item.soluong : 0,
        });
      }

      return acc;
    }, []);
  }

  convertHotSpotType(rawType: string): HotSpotType | undefined {
    switch (rawType) {
      case 'Khu công nghiệp':
        return 'IndustrialPark';
      case 'BOT':
        return 'BOT';
      case 'Giáo xứ':
        return 'Parish';
      default:
        return undefined;
    }
  }
}
