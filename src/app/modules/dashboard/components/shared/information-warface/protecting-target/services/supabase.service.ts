import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMucTieuBaoVeService extends SupabaseService{
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

  async tctt_muc_tieu_bao_ve(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_tong_quan_muc_tieu_bao_ve', {
      _code: code || '0',
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  async tctt_detail_muc_tieu_bao_ve(code?: any, id?: any) {
    var sp: any = this.supabase.schema('public');
    const _id = await id;
    var res = await sp.rpc('tctt_chi_tiet_muc_tieu_bao_ve', {
      _code: code || '0',
      _id_type: _id || '8403379c-6feb-4e0e-8209-ce01444b2fbe',
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  getSupabase() {
    return this.supabase;
  }
}
