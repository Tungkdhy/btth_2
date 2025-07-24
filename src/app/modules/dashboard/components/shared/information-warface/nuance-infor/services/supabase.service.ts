import {Injectable} from '@angular/core';
import {formatDate} from "@angular/common";
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseSacThaiService extends SupabaseService {
  handleResponse(response: any) {
    const { data, error, status } = response;

    if (error && status !== 406) {
      console.error('Error:', error);
    }

    return data || undefined;
  }

  handleError(error: any) {
    if (error instanceof Error) {
      console.error('Exception:', error);
    }
  }

  formatDateTime(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  async tctt_chi_so_sac_thai(
    from: any,
    to?: any,
    system?: any,
  ): Promise<{ data: { x: string; y: any }[]; updated: any }> {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_so_sac_thai', {
      _from: formatDate(from, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      _to: formatDate(to, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      _systemname: system,
    });

    if (res.error) {
      console.error('err:', res.error);
      return { data: [], updated: null };
    }

    return {
      data: [
        {x: 'Tích cực', y: res?.data[0].tichcuc},
        {x: 'Trung lập', y: res?.data[0].trungtinh},
        {x: 'Cần xác minh', y: res?.data[0].tieucuc},
      ],
      updated: this.formatDateTime(new Date()),
    };
  }

  async tctt_chi_tiet_sac_thai(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_sac_thai', {
      _from: formatDate(from, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      _to: formatDate(to, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  getSupabase() {
    return this.supabase;
  }
}
