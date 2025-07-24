import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseDiemNongService extends SupabaseService{
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

  async tctt_tong_quan_diem_nong(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_tong_quan_diem_nong', {
      _code: code || '0',
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tổng quan điểm nóng - Done');
    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_diem_nong(code?: any, typeId?: any) {
    var sp: any = this.supabase.schema('public');
    const _id = await typeId;
    var res = await sp.rpc('tctt_chi_tiet_diem_nong', {
      _code: code || '0',
      _id_type: _id || '',
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tổng quan điểm nóng - Done');
    return res?.error ? [] : res?.data;
  }

  /* ---------------------Điểm nóng new------------------ */
  async tctt_chi_tiet_khu_cong_nghiep(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_khu_cong_nghiep', {
      _code: code || '0',
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_bot(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_bot', {
      _code: code || '0',
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_giao_xu(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_giao_xu', {
      _code: code || '0',
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }
  /* ---------------------------------------------------- */

  async tctt_trang_thai_bot(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_trang_thai_bot', {
      _code: code || '0',
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  async tctt_so_luong_bot_theo_tinh(code?: any, limit?: number) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_so_luong_bot_theo_tinh', {
      _code: code || '0',
      _limit: limit || 10,
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  async tctt_trang_thai_giao_xu(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_trang_thai_giao_xu', {
      _code: code || '0',
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  async tctt_so_luong_giao_xu_theo_tinh(code?: any, limit?: number) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_so_luong_giao_xu_theo_tinh', {
      _code: code || '0',
      _limit: limit || 10,
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  async tctt_trang_thai_khu_cong_nghiep(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_trang_thai_khu_cong_nghiep', {
      _code: code || '0',
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  async tctt_so_luong_khu_cong_nghiep_theo_tinh(code?: any, limit?: number) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_so_luong_khu_cong_nghiep_theo_tinh', {
      _code: code || '0',
      _limit: limit || 10,
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  getSupabase() {
    return this.supabase;
  }
}
