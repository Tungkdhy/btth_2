import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseSafeTyInformationAlertService {
  public supabase:any;

  constructor(
    private supabaseService: SupabaseService,
  ) {
    this.supabase = this.supabaseService.getSupabase()
  }

  async getThongKeCanhBao(
    main_type: string,
    sub_type: any,
    loploi: any = null,
    from: any = null,
    end: any = null,
  ): Promise<any> {
    if (!sub_type) {
      return [];
    }
    var sp = this.supabase
      .schema('btth')
      .rpc('count_su_co_security', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : null,
        _loploi: loploi,
        _lopbien: null,
        _from: from
          ? this.supabaseService.formatDateCustom(from)
          : this.supabaseService.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _end: end
          ? this.supabaseService.formatDateCustom(end)
          : this.supabaseService.endOfDayFormatted(new Date()),
      })
      .select('*');

    const b = await sp;
    return b.error ? [] : b.data;
  }
  getSupabase() {
    return this.supabase;
  }
}
