import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseProtectingTargetService extends SupabaseService{
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

  async tctt_thong_tin_muc_tieu_bao_ve(id: string) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_thong_tin_muc_tieu_bao_ve', {
      _id_target: id,
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  // donut
  async tctt_sac_thai_muc_tieu_bao_ve(
    id: string,
    code: string,
    system: string,
  ) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_sac_thai_muc_tieu_bao_ve', {
      _id: id,
      _code: code || '1',
      _system: system,
    });
    if (res.error) console.error('err:', res.error);

    let resTransform = {
      data: [
        { x: 'Tích cực', y: res?.data[0].tintichcuc },
        { x: 'Trung lập', y: res?.data[0].tintrunglap },
        { x: 'Cần xác minh', y: res?.data[0].tintieucuc },
      ],
      centerLabel: res?.data[0].tongtinbai,
    };

    return res?.error ? [] : resTransform;
  }

  // column chart
  async tctt_sac_thai_muc_tieu_bao_ve_theo_nen_tang(
    id: string,
    code: string,
    system: string,
  ) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_sac_thai_muc_tieu_bao_ve_theo_nen_tang', {
      _id: id,
      _code: code || '1',
      _system: system,
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  // Bai viet tieu cuc
  async tctt_tin_tieu_cuc_theo_muc_tieu_bao_ve(id: string, code: string) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_tin_tieu_cuc_theo_muc_tieu_bao_ve', {
      _id_target: id,
      _code: code || '1',
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  //bieu do line
  async tctt_xu_huong_tieu_cuc_theo_muc_tieu_bao_ve(id: string, code: string) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_xu_huong_tieu_cuc_theo_muc_tieu_bao_ve', {
      _id_target: id,
      _code: code || '1',
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  // Bang tin boc go
  async tctt_boc_go_theo_muc_tieu_bao_ve(id: string, code: string) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_boc_go_theo_muc_tieu_bao_ve', {
      _id_target: id,
      _code: code || '1',
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }
}
