import { Injectable } from '@angular/core';
import { convertFormatDateTimeTctt } from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseBaiTieuCucService extends SupabaseService{
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

  getRandomNumber() {
    let randomNumber = Math.random() * 0.2;
    return parseFloat(randomNumber.toFixed(2));
  }

  async tctt_ty_le_bai_viet_tieu_cuc(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_ti_le_tieu_cuc', {
      _from: from,
      _to: to,
    });
    if (res?.data) {
      const convertedData = res?.data?.map((item: any) => ({
        ...item,
        tile: parseFloat(item?.tile?.toFixed(2)),
        ngay: convertFormatDateTimeTctt(item?.ngay),
      }));
      return convertedData;
    }
    if (res.error) res?.error;
  }

  async tctt_ti_le_tieu_cuc_theo_khoang(from: any, to: any) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_ti_le_tieu_cuc_theo_khoang', {
      _from: from,
      _to: to,
    });
    if (res?.data) {
      const convertedData = res?.data?.map((item: any) => ({
        ...item,
        tile: parseFloat(item?.tile?.toFixed(2)),
      }));
      return convertedData;
    }
    if (res?.error) res?.error;
  }

  getSupabase() {
    return this.supabase;
  }
}
