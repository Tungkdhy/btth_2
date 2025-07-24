import { Injectable } from '@angular/core';
import { Constant } from 'src/app/core/config/constant';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseSafeTyInformationService {
  public supabase:any;

  constructor(
    private supabaseService: SupabaseService,
  ) {
    this.supabase = this.supabaseService.getSupabase()
  }
  async getDinhDanhKhongDongNhat(
    main_type: any = null,
    _sub_type: any = '728',
    _loploi: any = null,
    _lopbien = null,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    let res = await sp
      .rpc('count_left_panel_attt', {
        _main_type: main_type ? main_type : null,
        _sub_type: _sub_type ? _sub_type : '728',
        _loploi: _loploi ? _loploi : null,
        _lopbien: _lopbien ? _lopbien : null,
        _from: from
          ? this.supabaseService.formatDateCustom(from)
          : this.supabaseService.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: to
          ? this.supabaseService.formatDateCustom(to)
          : this.supabaseService.endOfDayFormatted(new Date()),
      })
      .select('*');
    if (res.error) {
      return [];
    }
    return res.data || [];
  }

  async getThongKeMaDocDaDuocLamSach(
    main_type: any = null,
    _sub_type: any = '728',
    _loploi: any = null,
    _lopbien = null,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    let res = await sp
      .rpc('count_left_panel_attt_2', {
        _main_type: main_type ? main_type : null,
        _sub_type: _sub_type ? _sub_type : '728',
        _loploi: _loploi ? _loploi : null,
        _lopbien: _lopbien ? _lopbien : null,
        _from: from
          ? this.supabaseService.formatDateCustom(from)
          : this.supabaseService.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: to
          ? this.supabaseService.formatDateCustom(to)
          : this.supabaseService.endOfDayFormatted(new Date()),
      })
      .select('*');
    if (res.error) {
      return [];
    }
    return res.data || [];
  }

  // Máy tính được làm sạch mã độc
  async mayTinhDuocLamSachMaDoc(
    main_type: any = null,
    sub_type: any = '728',
    loploi: any = null,
    lopbien = null,
    is_click_trong_ngay: boolean = false,
    alert_source: any = '',
    from: any = null,
    to: any = null,
    page_index: number = 1,
    page_size: number = 10,
  ) {
    let sp = this.supabase
      .schema('btth')
      .from('view_security_event')
      .select('*', { count: 'exact', head: false });
    if (main_type) sp = sp.eq('main_type', main_type ? main_type : null);
    if (loploi) sp = sp.eq('loi', loploi);
    if (lopbien) sp = sp.eq('bien', lopbien);
    sp = sp.lt('warning_level', 3);
    if (alert_source) {
      sp = sp.eq('alert_source', alert_source);
    }
    if (is_click_trong_ngay) {
      sp = from
        ? sp.gte('last_active', this.supabaseService.formatDateCustom(from))
        : sp.gte('last_active', this.supabaseService.eightHourOfDayFormatted(new Date().getTime() - 86400000));
      sp = to
        ? sp.lte('last_active', this.supabaseService.formatDateCustom(to))
        : sp.lte('last_active', this.supabaseService.endOfDayFormatted(new Date()));
    }

    sp = sp.order('last_active', { ascending:false, nullsFirst: false });

    let list: any = await sp.range(
      (page_index - 1) * page_size,
      page_index * page_size - 1,
    );
    return list.error
      ? null
      : {
          total: list?.count || 0,
          items: list?.data || [],
          page_index,
          page_size,
        };
  }

  // Mã độc thông thường/ có chủ đích được nhận diện
  async malwareTa21Count(
    main_type: any = null,
    coChuDich: boolean = false,
    is_click_trong_ngay: boolean = false,
    from: any = null,
    to: any = null,
  ) {
    let sp = this.supabase
      .schema('btth');
    if (coChuDich) sp = sp.from('malware_ta21_parent');
    else sp = sp.from('view_malware_ta21');
    sp= sp.select('*', { count: 'exact', head: true });
    // if (main_type) sp = sp.eq('main_type', main_type ? main_type : null);
    if (is_click_trong_ngay) {
      sp = from
        ? sp.gte('created_at', this.supabaseService.formatDateCustom(from))
        : sp.gte('created_at', this.supabaseService.eightHourOfDayFormatted(new Date().getTime() - 86400000));
      sp = to
        ? sp.lte('created_at', this.supabaseService.formatDateCustom(to))
        : sp.lte('created_at', this.supabaseService.endOfDayFormatted(new Date()));
    }
    if (!coChuDich) sp = sp.is('parent', null);
    let resp = await sp;
    return resp?.count || 0;
  }
  // Mã độc thông thường/ có chủ đích được nhận diện
  async malwareTa21GetList(
    main_type: any = null,
    coChuDich: boolean = false,
    is_click_trong_ngay: boolean = false,
    from: any = null,
    to: any = null,
    page_index: number = 1,
    page_size: number = 10,
  ) {
    let sp = this.supabase
      .schema('btth')
      .from('view_malware_ta21')
      .select('*', { count: 'exact', head: false });
    if (main_type) sp = sp.eq('main_type', main_type ? main_type : null);
    if (coChuDich) sp = sp.eq('malware_family', 'APT_PlugX');
    if (is_click_trong_ngay) {
      sp = from
        ? sp.gte('created_at', this.supabaseService.formatDateCustom(from))
        : sp.gte('created_at', this.supabaseService.eightHourOfDayFormatted(new Date().getTime() - 86400000));
      sp = to
        ? sp.lte('created_at', this.supabaseService.formatDateCustom(to))
        : sp.lte('created_at', this.supabaseService.endOfDayFormatted(new Date()));
    }
    sp = sp.order('created_at', { ascending:false, nullsFirst: false });
    let list: any = await sp.range(
      (page_index - 1) * page_size,
      page_index * page_size - 1,
    );
    return list.error
      ? null
      : {
          total: list?.count || 0,
          items: list?.data || [],
          page_index,
          page_size,
        };
  }

  async getCountRecord345(
    main_type: any = null,
    _sub_type: any = '728',
    _loploi: any = null,
    _lopbien = null,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    let res = await sp
      .rpc('count_left_panel_httt', {
        _main_type: main_type ? main_type : null,
        _sub_type: _sub_type ? _sub_type : '728',
        _loploi: _loploi ? _loploi : null,
        _lopbien: _lopbien ? _lopbien : null,
        _from: from
          ? this.supabaseService.formatDateCustom(from)
          : this.supabaseService.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: to
          ? this.supabaseService.formatDateCustom(to)
          : this.supabaseService.endOfDayFormatted(new Date()),
      })
      .select('*');
    if (res.error) {
      return [];
    }
    return res.data || [];
  }
}
