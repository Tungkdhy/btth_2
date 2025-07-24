import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseItInfraService {
  public supabase: any;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getSupabase();
  }

  async getThongKeDevice(main_type: string, sub_type: any, loploi: any = null) {
    if (!sub_type) {
      return [];
    }
    let sp = this.supabase
      .schema('btth')
      .from('view_device_v2')
      .select('type, count()')
      .contains('sources',['HSM'])
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp = sp.eq('loploi', loploi);
    const b = await sp;
    return b.error ? [] : b.data;
  }

  async getThongKeUngDungDichVu(
    service_type: string,
    main_type: string,
    sub_type: any,
    loploi: any = null,
  ) {
    var sp = this.supabase
      .schema('btth')
      .from('view_service')
      .select('count()');
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp = sp.eq('loi', loploi);

    var res: any = await sp
      .eq('type', service_type)
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    return res?.error ? 0 : res?.data[0]?.count || 0;
  }

  async getThongKeEndpoint(
    _main_type: string,
    _sub_type: string = '728',
    loploi: any = null,
    lopbien: any= null
  ) {
    let b = await this.supabase
      .schema('btth')
      .rpc('view_endpoint_count', {
        _main_type: _main_type ? _main_type : null,
        _sub_type,
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null
      })
      .select('*');
    return b.error ? [] : b.data;
  }

  async getThongKeTongSo(
    _main_type: string,
    _sub_type: string = '728',
  ) {
    let sp =  this.supabase
      .schema('btth')
      .from('view_unit_thucluc')
      .select('*');
      if(_sub_type){
        sp= sp
        .or(
          'unit_path_text.eq.' +
          _sub_type + ',' +
          'unit_path_text.like.' +
          _sub_type +
          '.%',
        );
      }

      if(_main_type){
        sp = sp.eq('main_type',_main_type? _main_type:null);
      }
    let b =  await sp;

    return b.error ? [] : b?.data || [];
  }
  async getThongKeTangGiam(
    main_type: string,
    sub_type: string = '728',
    loploi: any = null,
    lopbien: any= null,
    from:any=null,
    to:any=null
  ) {

    let sp = await this.supabase
      .schema('btth')
      .rpc('f_tanggiam', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : null,
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _from: from
          ? this.supabaseService.formatDateCustom(from)
          : this.supabaseService.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to:to
          ? this.supabaseService.formatDateCustom(to)
          : this.supabaseService.eightHourOfDayFormatted(new Date()),
      })
      .select('*');

      return sp?.data || [];
  }

  async getUnit() {
    let sp: any = await this.supabase.schema('btth');
    sp = sp.from('view_unit').select('*');
    var b: any = await sp;
    return b.error ? [] : b.data;
  }
}
