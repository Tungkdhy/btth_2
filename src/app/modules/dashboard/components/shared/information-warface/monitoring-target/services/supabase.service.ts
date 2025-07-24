import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
@Injectable({
  providedIn: 'root',
})
export class SupabaseGiamSatService extends SupabaseService {
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

  async tctt_tuong_quan_muc_tieu(code: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_tuong_quan_muc_tieu', {
      _code: code,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tương quan mục tiêu - Done');
    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_doi_tuong(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_doi_tuong', {
      _code: code,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('data chi tiet muc tieu - Done');
    if (res?.data) {
      const convertedData = res?.data?.map((item: any, index: any) => ({
        ...item,
      }));
      return convertedData;
    }
    return [];
  }

  async tctt_tuong_quan_muc_tieu_ct86(code: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_tuong_quan_muc_tieu_ct86', {
      _code: code,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tương quan mục tiêu - Done');
    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_doi_tuong_ct86(code?: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_doi_tuong_ct86', {
      _code: code,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('data chi tiet muc tieu - Done');
    if (res?.data) {
      const convertedData = res?.data?.map((item: any, index: any) => ({
        ...item,
      }));
      return convertedData;
    }
    return [];
  }

  getSupabase() {
    return this.supabase;
  }
}
