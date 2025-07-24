import { Injectable } from '@angular/core';

import {
  AuthSession,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Constant } from 'src/app/core/config/constant';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseInfrastructureAlertService {
  public supabase:any;

  constructor(
    private supabaseService: SupabaseService,
  ) {
    this.supabase = this.supabaseService.getSupabase()
  }

  async getThongKeSuCoHaTangUDDV(
    main_type:any= null,
    sub_type= '728',
    n_day:number,
    loploi = null,
    lopbien = null,
    from:any=null,
    to:any= null
  ) {

    var res = await this.supabase.schema('btth').rpc('count_su_co', {
      _path: sub_type,
      _main_type: main_type ? main_type : null,
      _loploi: loploi,
      _lopbien: lopbien,
      _from: from
          ? this.supabaseService.formatDateCustom(from)
          : this.supabaseService.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: to
          ? this.supabaseService.formatDateCustom(to)
          : this.supabaseService.endOfDayFormatted(new Date()),
    });
    return res?.error ? [] : res?.data;
  }

  async getUnit() {
    let sp: any = await this.supabase.schema('btth');
    sp = sp.from('view_unit').select('*');
    var b: any = await sp;
    return b.error ? [] : b.data;
  }
  // tab5
  getSupabase() {
    return this.supabase;
  }
}
