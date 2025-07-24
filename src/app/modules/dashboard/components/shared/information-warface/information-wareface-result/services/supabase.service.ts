import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseKQTacChienService extends SupabaseService{
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

  async tctt_boc_go(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_boc_go', {
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  async tctt_trang_thai_kenh_tuyen_truyen(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_trang_thai_kenh_tuyen_truyen', {
      _code: code || '0',
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  async tctt_tong_quan_chi_thi(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_tong_quan_chi_thi', {
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_chi_thi(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_chi_thi', {
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_kenh_truyen_thong(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_kenh_truyen_thong', {
      _code: code || '0',
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_boc_go(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_boc_go', {
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  getSupabase() {
    return this.supabase;
  }
}
