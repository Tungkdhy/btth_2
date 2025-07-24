import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseKQDangTaiService extends SupabaseService{

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

  async tctt_chi_tiet_kq_dang_tai(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_ket_qua_dang_tai', {
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('chi tiết kết quả đăng tải - Done');
    return res?.error ? [] : res?.data;
  }

  async tctt_kq_dang_tai(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_ket_qua_dang_tai', {
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);
    const processedData = res.data?.map((item: any) => {
      return {
        ...item,
        // tendonvi: item.tendonvi.replace(/Trung tâm/g, 'TT'),
        tendonvi: item.tendonvi.replace(/\s*Trung tâm\s*/g, 'TT'),
      };
    });
    return res?.error ? [] : processedData;
  }

  getSupabase() {
    return this.supabase;
  }
}
