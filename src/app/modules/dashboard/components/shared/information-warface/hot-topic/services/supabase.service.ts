import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseChuDeNongService extends SupabaseService{
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

  async tctt_thong_ke_chu_de_nong(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_thong_ke_chu_de_nong', {
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_thong_ke_chu_de_nong(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_thong_ke_chu_de_nong', {
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  async tctt_tong_quan_theo_chu_de(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_tong_quan_theo_chu_de', {
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);

    return res?.error ? [] : res?.data;
  }

  async tctt_danh_sach_chu_de(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_danh_sach_chu_de', {
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Danh sách chủ đề nóng - Done');
    return res?.error ? [] : res?.data;
  }

  async tctt_danh_sach_diem_tin(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_danh_sach_diem_tin', {
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
