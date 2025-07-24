import { Injectable } from '@angular/core';

import {
  AuthSession,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Constant } from '../../../core/config/constant';
import { stats } from '../data/information-warfare';
import { BriefProvince, DeviceStats } from '../models/geographical-coordinates';
import {
  BCTTRouterDto,
  SecurityEventCountDto,
  TCTTTargetsDto,
} from '../models/btth.dto';
import { UnitTreeFilter } from '../models/unit-tree-filter';
import { DeviceType, EndpointType, TCTTTargetType } from '../models/btth.type';
import {
  MainType,
  MonitoringSystemType,
  UnitPath,
} from '../models/btth.interface';
import {
  PostgrestFilterBuilder,
  PostgrestTransformBuilder,
} from '@supabase/postgrest-js';
import { ascending } from 'ol/array';
import { StatsApiFilters } from '../../../store/map-interaction/device-stats/device-stats.models';
import { formatDate } from '@angular/common';
import { formatDateTime } from 'src/app/_metronic/layout/core/common/common-utils';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  protected supabase: SupabaseClient<any, string, any>;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(Constant.SUPABASE.URL, Constant.SUPABASE.KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    // Lắng nghe mọi thay đổi của Auth
    // this.supabase.auth.onAuthStateChange((event, session) => {
    //   this._session = session; // Lưu session mới nhất vào biến _session
    //
    //   switch (event) {
    //     case 'SIGNED_IN':
    //     case 'TOKEN_REFRESHED':
    //       if (session) {
    //         this.supabase.auth.setSession({
    //           access_token: session.access_token,
    //           refresh_token: session.refresh_token,
    //         });
    //       }
    //       break;
    //     case 'SIGNED_OUT':
    //       console.log('Người dùng đã đăng xuất');
    //       // Nếu muốn chuyển hướng về trang login:
    //       // this.router.navigate(['/login']);
    //       break;
    //     default:
    //       console.log('Auth event:', event);
    //       break;
    //   }
    // });
  }

  fetchUnits1(): Observable<any> {
    const builder = this.supabase
      .schema('btth')
      .from('view_unit')
      .select()
      .order('path');
    return from(this.fetchDataByBuilder(builder));
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  async getAccessToken(): Promise<string | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token || null;
  }

  // Subscribe to the Channel

  // signIn(email: string, password: string) {
  //   return this.supabase.auth.signInWithPassword({
  //     email: email, //'diep@email.com',
  //     password: password, //'Abc@123',
  //   });
  // }

  async signIn(email: string, password: string) {
    // Gọi Supabase Auth
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Lỗi đăng nhập:', error.message);
      throw new Error(error.message);
    }

    // Lúc này, onAuthStateChange sẽ bắn event 'SIGNED_IN' và cập nhật this._session
    // Bạn có thể return data.session nếu component/trình gọi cần
    return data.session;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Xảy ra lỗi:', error.message);
      throw new Error(error.message);
    }
  }

  // ===============================
  // MID PANEL METHODS: BEGIN
  // ===============================

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

  async callPostgresFunction(
    functionName: string,
    args?: object,
    schema: string = 'btth',
  ) {
    try {
      const response = await this.supabase
        .schema(schema)
        .rpc(functionName, args);

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async fetchDataFromTable(tableName: string, schema: string = 'btth') {
    try {
      const response = await this.supabase
        .schema(schema)
        .from(tableName)
        .select();

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async fetchDataByBuilder(builder: PostgrestFilterBuilder<any, any, any>) {
    try {
      const response = await builder;

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async executeByBuilder(
    builder: PostgrestTransformBuilder<any, any, any, any, any>,
  ) {
    try {
      const response = await builder;

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async upsertData(builder: PostgrestFilterBuilder<any, any, any>) {
    try {
      const response = await this.supabase
        .schema('asdf')
        .from('asdf')
        .upsert({})
        .select();

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  fetchNetworkSystem(): Promise<any> {
    return this.fetchDataFromTable('loi_bien_truycap');
  }

  fetchTopologyByUnitPath(unitPath: string): Promise<any> {
    return this.callPostgresFunction('get_topology_by_unit_path', {
      unitpath: unitPath,
    });
  }

  fetchTopologyByUnitPathV2(
    mainType: MainType,
    unitPath: string,
  ): Promise<any> {
    return this.callPostgresFunction('get_topology_by_unit_path_v2', {
      maintype: mainType,
      unitpath: unitPath,
    });
  }

  fetchTopologyByUnitPathAndSystemType(
    systemType: MonitoringSystemType,
    mainType: MainType,
    unitPath: string,
  ): Promise<any> {
    return this.callPostgresFunction(
      `get_topology_by_unit_path_${systemType}`,
      {
        maintype: mainType,
        unitpath: unitPath,
      },
    );
  }

  getProvinces(): Promise<BriefProvince[]> {
    return this.callPostgresFunction('get_provinces_info');
  }

  getProvinceByName(name: string): Promise<BriefProvince[]> {
    return this.callPostgresFunction('get_provinces_by_name', {
      search_name: name,
    });
  }

  getInformationWareData() {
    return stats;
  }

  getUnitTree(unitTreeFilter: UnitTreeFilter) {
    return this.callPostgresFunction(
      'unit_tree_filter',
      unitTreeFilter.mapToDatabase(),
    );
  }

  countDeviceByUnitFrom(path: string) {
    return this.callPostgresFunction('count_device_by_unit_from', {
      _path: path,
    });
  }

  countSecurityEventByUnitFrom(
    path: string = '',
    dateFrom: string | null = null,
    dateTo: string | null = null,
  ): Promise<SecurityEventCountDto[]> {
    return this.callPostgresFunction('count_security_event_by_unit_from', {
      _path: path,
      _date_from: dateFrom,
      _date_to: dateTo,
    });
  }

  getCoreLayer(): Promise<DeviceStats[]> {
    return this.callPostgresFunction('get_core_layer_coordinates');
  }

  getBoundaryLayer(): Promise<DeviceStats[]> {
    return this.callPostgresFunction('get_boundary_layer_coordinates');
  }

  getAccessLayer(): Promise<DeviceStats[]> {
    return this.callPostgresFunction('get_access_layer_coordinates');
  }

  getBoundaryLayerByCore(coreLayerId: string): Promise<DeviceStats[]> {
    return this.callPostgresFunction('get_boundary_layer_coordinates', {
      core_layer_id: coreLayerId,
    });
  }

  getAccessLayerByBoundary(boundaryLayerId: string): Promise<DeviceStats[]> {
    return this.callPostgresFunction('get_access_layer_coordinates', {
      boundary_layer_id: boundaryLayerId,
    });
  }

  getTCTTTargetsByType(type: TCTTTargetType): Promise<TCTTTargetsDto[]> {
    return this.callPostgresFunction('get_tctt_targets_by_type', { type });
  }

  async getAllBCTTRouter(): Promise<BCTTRouterDto[] | undefined> {
    try {
      const { data, error, status } = await this.supabase
        .schema('btth')
        .from('loi_bien_truycap')
        .select();

      if (error && status !== 406) {
        console.log(error);
      }

      if (data) {
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  protected fetchMapDeviceCountFnc(filters: StatsApiFilters) {
    return this.callPostgresFunction('map_device_count', {
      _main_type: filters.mainType,
      _arr_sub_type: filters.subTypeList,
      _loploi: filters.core,
      _arr_lopbien: filters.boundaryList,
    });
  }

  protected fetchMapCoreDeviceCountFnc(filters: StatsApiFilters) {
    return this.callPostgresFunction('map_device_count', {
      _main_type: filters.mainType,
      _arr_sub_type: filters.subTypeList,
      _arr_loploi: filters.coreList,
    });
  }

  protected fetchMapEndpointCountFnc(filters: StatsApiFilters) {
    return this.callPostgresFunction('map_endpoint_count', {
      _main_type: filters.mainType,
      _arr_sub_type: filters.subTypeList,
      _loploi: filters.core,
      _arr_lopbien: filters.boundaryList,
    });
  }

  protected fetchMapCoreEndpointCountFnc(filters: StatsApiFilters) {
    return this.callPostgresFunction('map_endpoint_count', {
      _main_type: filters.mainType,
      _arr_sub_type: filters.subTypeList,
      _arr_loploi: filters.coreList,
    });
  }

  protected fetchMapAlertCountFnc(filters: StatsApiFilters) {
    const startDate = filters.fromDate ?? Constant.TODAY.startDate;
    const endDate = filters.toDate ?? Constant.TODAY.endDate;
    const from = formatDate(startDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    const to = formatDate(endDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');

    return this.callPostgresFunction('map_alert_count', {
      _main_type: filters.mainType,
      _arr_sub_type: filters.subTypeList,
      _loploi: filters.core,
      _arr_lopbien: filters.boundaryList,
      _from: from,
      _to: to,
    });
  }

  protected fetchMapCoreAlertCountFnc(filters: StatsApiFilters) {
    const startDate = filters.fromDate ?? Constant.TODAY.startDate;
    const endDate = filters.toDate ?? Constant.TODAY.endDate;
    const from = formatDate(startDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    const to = formatDate(endDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');

    return this.callPostgresFunction('map_alert_count', {
      _main_type: filters.mainType,
      _arr_sub_type: filters.subTypeList,
      _arr_loploi: filters.coreList,
      _from: from,
      _to: to,
    });
  }

  protected fetchEndpointTreeCountFnc(
    mainType: EndpointType | null,
    subType: string | null,
    endpointType: string | null,
    coreLayerName: string | null,
    boundaryLayerName: string | null,
    isAuto: boolean,
  ) {
    return this.callPostgresFunction('view_endpoint_tree_count', {
      _main_type: mainType,
      _sub_type: subType,
      _col_type: endpointType,
      _loploi: coreLayerName,
      _lopbien: boundaryLayerName,
      _auto: isAuto,
    });
  }

  fetchSecurityEventTreeCountFnc(
    mainType: string | null,
    subType: string | null = UnitPath.ROOT,
    alertType: string | null = null,
    coreLayerName: string | null = null,
    boundaryLayerName: string | null = null,
    isAuto: boolean = true,
    warningLevel: number = 3,
    fromDate?: string,
    toDate?: string,
  ) {
    const now = new Date();
    fromDate =
      fromDate ??
      formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
      );
    toDate =
      toDate ??
      formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
      );

    return this.callPostgresFunction('view_security_event_tree_count', {
      _main_type: mainType,
      _sub_type: subType,
      _col_type: alertType,
      _loploi: coreLayerName,
      _lopbien: boundaryLayerName,
      _auto: isAuto,
      _warning_level: warningLevel,
      _from: fromDate,
      _to: toDate,
    });
  }

  protected fetchDeviceTreeCountFnc(
    mainType: DeviceType | null,
    subType: string | null,
    endpointType: string | null,
    coreLayerName: string | null,
    boundaryLayerName: string | null,
    isAuto: boolean,
  ) {
    return this.callPostgresFunction('view_device_tree_count', {
      _main_type: mainType,
      _sub_type: subType,
      _col_type: endpointType,
      _loploi: coreLayerName,
      _lopbien: boundaryLayerName,
      _auto: isAuto,
    });
  }

  protected fetchInfoWarfareOverview(limit: number = 10): Promise<void> {
    return this.callPostgresFunction(
      'tctt_sac_thai_dia_ban',
      { _count: limit },
      'public',
    );
  }

  protected fetchContactInformation(unitPath: string) {
    return this.callPostgresFunction('lienhe', { pathdonvi: unitPath });
  }

  public fetchSettings() {
    return this.fetchDataFromTable('setiing');
  }

  // ===============================
  // MID PANEL METHODS: END
  // ===============================

  // async getThongKeTrienKhaiATTT(main_type: string) {
  //   let sp: any = this.supabase.schema('btth');
  //   let res = await sp
  //     .rpc('count_endpoint_by_unit_from_2', {
  //       _path: Constant.SUB_TYPE_DEVICE.ROOT,
  //       _main_type: main_type ? main_type : null,
  //       create_at_from: this.formatDateCustom(new Date()),
  //     })
  //     .select('*');
  //   if (res.error) {
  //     return [];
  //   }
  //   return res.data || [];
  // }

  async getThongKeBieuDoCotThietBiDauCuoiMidPanel(
    main_type: any = null,
    sub_type: string = '728',
    col_type: number = 1,
    loploi: any = null,
    is_click_trong_ngay: boolean = false,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_endpoint_v2');

    if (col_type == 1) sp = sp.select('sources,count()');
    else if (col_type == 2) sp = sp.select('loploi,count()');
    else if (col_type == 3) sp = sp.select('loploi,count()');
    sp = sp
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      )
      .neq('type', 'OTHER');

    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loploi', loploi);
    if (col_type == 2) sp = sp.neq('status', 'IDENT');
    else if (col_type == 3) sp = sp.is('unit_cfl', true);
    if (is_click_trong_ngay) {
      sp = from
        ? sp.gte('first_install_ts', this.formatDateCustom(from))
        : sp.gte(
            'first_install_ts',
            this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
          );
      sp = to
        ? sp.lte('first_install_ts', this.formatDateCustom(to))
        : sp.lte('first_install_ts', this.endOfDayFormatted(new Date()));
    }
    const resp: any = await sp;
    if (resp.error) {
      return [];
    }
    resp.data.forEach((el: any) => {
      el.status = el.not_online ? false : true;
    });
    return resp.data || [];
  }

  async getThongKeBieuDoTronThietBiDauCuoiMidPanel(
    main_type: any = null,
    sub_type: string = '728',
    col_type: number = 1,
    loploi: any = null,
    is_click_trong_ngay: boolean = false,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_endpoint_v2');
    sp = sp
      .select('not_online,count()')
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      )
      .neq('type', 'OTHER');

    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loploi', loploi);
    if (col_type == 2) sp = sp.neq('status', 'IDENT');
    else if (col_type == 3) sp = sp.is('unit_cfl', true);
    if (is_click_trong_ngay) {
      sp = from
        ? sp.gte('first_install_ts', this.formatDateCustom(from))
        : sp.gte(
            'first_install_ts',
            this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
          );
      sp = to
        ? sp.lte('first_install_ts', this.formatDateCustom(to))
        : sp.lte('first_install_ts', this.endOfDayFormatted(new Date()));
    }
    const resp: any = await sp;
    if (resp.error) {
      return [];
    }
    resp.data.forEach((el: any) => {
      el.status = el.not_online ? false : true;
    });
    return resp.data || [];
  }

  // col_type
  // deefault + otherwise (2,3): Triển khai giải pháp ATTT trên thiết bị đầu cuối
  // 2: Chưa định danh
  // 3: Định danh không đồng nhất
  async trienKhaiGiaiPhapATTTTrenThietBiDauCuoi(
    main_type: any = null,
    sub_type: any = '728',
    loploi: any = null,
    lopbien = null,
    sources: any = [],
    col_type: number = 1,
    is_click_trong_ngay: boolean = false,
    search_text: string = '',
    status_type: string = '',
    from: any = null,
    to: any = null,
    page_index: number = 1,
    page_size: number = 5,
  ) {
    let sp = this.supabase
      .schema('btth')
      .from('view_endpoint_v2')
      .select('*', { count: 'exact', head: false })
      .neq('type', 'OTHER');
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp = sp.eq('loploi', loploi);
    if (lopbien) sp = sp.eq('lopbien', lopbien);
    if (col_type == 2) sp = sp.neq('status', 'IDENT');
    else if (col_type == 3) sp = sp.is('unit_cfl', true);
    if (sources.length > 0) {
      sp = sp.contains('sources', [sources]);
    }
    if (is_click_trong_ngay) {
      sp = from
        ? sp.gte('first_install_ts', this.formatDateCustom(from))
        : sp.gte(
            'first_install_ts',
            this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
          );
      sp = to
        ? sp.lte('first_install_ts', this.formatDateCustom(to))
        : sp.lte('first_install_ts', this.endOfDayFormatted(new Date()));
    }

    sp = sp.or(
      'unit_path_text.eq.' +
        sub_type +
        ',' +
        'unit_path_text.like.' +
        sub_type +
        '.%',
    ); //.order('last_active', {ascending:false, nullsFirst: false});
    if (search_text) {
      sp = sp.ilike('search_text', '%' + search_text?.trim() + '%');
    }
    if (status_type == 'true') {
      sp.is('not_online', true);
    }
    if (status_type == 'false') {
      sp.is('not_online', false);
    }
    if (col_type == 1) {
      sp = sp.order('first_install_ts', {});
    } else {
      sp = sp.order('not_online', { ascending: false });
      sp = sp.order('last_active', { ascending: false, nullsFirst: false });
    }
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

  // Máy tính được làm sạch mã độc
  async mayTinhDuocLamSachMaDoc(
    main_type: any = null,
    sub_type: any = '728',
    loploi: any = null,
    lopbien = null,
    is_click_trong_ngay: boolean = false,
    alert_source: any = '',
    searchText: any = null,
    not_online: any = null,
    from: any = null,
    to: any = null,
    page: number = 1,
    limit: number = 5,
  ) {
    /*
    FUNCTION btth.su_co_security_lam_sach_list(
      _main_type "MAIN_TYPE", _sub_type ltree,
      _loploi text, _lopbien text,
      _from timestamp without time zone, _to timestamp without time zone,
      _page int, _limit int
    )
    */
    var sp = this.supabase
      .schema('btth')
      .rpc('su_co_security_lam_sach_list', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : null,
        _loploi: loploi,
        _lopbien: null,
        _from: !is_click_trong_ngay
          ? null
          : from
          ? this.formatDateCustom(from)
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _end: !is_click_trong_ngay
          ? null
          : to
          ? this.formatDateCustom(to)
          : this.eightHourOfDayFormatted(new Date()),
        _alert_source: alert_source ? alert_source : null,
        _search_text: searchText ? searchText?.trim() : null,
        _not_online:
          not_online == 'true' ? true : not_online == 'false' ? false : null,
        _page: page,
        _limit: limit,
      })
      .select('*');

    let list: any = await sp;

    return list.error
      ? null
      : {
          items: list?.data[0]?.data?.map((item: any) => item?.data) || [],
          total: list?.data[0]?.total || 0,
          page_index: list?.data[0]?.page || 1,
          page_size: list?.data[0]?.limit || limit,
        };
  }

  async ThongKeBieuDoMayTinhDuocLamSachMaDoc(
    main_type: any = null,
    sub_type: any = '728',
    loploi: any = null,
    lopbien = null,
    is_click_trong_ngay: boolean = false,
    alert_source: any = '',
    searchText: any = null,
    not_online: any = null,
    from: any = null,
    to: any = null,
  ) {
    var sp = this.supabase
      .schema('btth')
      .rpc('su_co_security_lam_sach_cat', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : null,
        _loploi: loploi,
        _lopbien: null,
        _from: !is_click_trong_ngay
          ? null
          : from
          ? this.formatDateCustom(from)
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _end: !is_click_trong_ngay
          ? null
          : to
          ? this.formatDateCustom(to)
          : this.endOfDayFormatted(new Date()),
        _alert_source: null,
        _search_text: null,
        _not_online: null,
      })
      .select('*');

    let list: any = await sp;
    return list.error ? null : list?.data[0] || null;
  }

  async detailMalwareTa21(
    parentId: number,
    page_index: number = 1,
    page_size: number = 10,
  ) {
    let sp: any = await this.supabase
      .schema('btth')
      .from('view_malware_ta21')
      .select('*', { count: 'exact', head: false })
      .eq('parent', parentId)
      .range((page_index - 1) * page_size, page_index * page_size - 1);
    return sp.error
      ? null
      : {
          items: sp?.data,
          total: sp?.count,
          page_index,
          page_size,
        };
  }

  // Mã độc thông thường/ có chủ đích được nhận diện
  async malwareTa21GetList(
    main_type: any = null,
    coChuDich: boolean = false,
    is_click_trong_ngay: boolean = false,
    searchText: any = null,
    from: any = null,
    to: any = null,
    page_index: number = 1,
    page_size: number = 10,
  ) {
    let sp: any = this.supabase.schema('btth');
    if (coChuDich) sp = sp.from('malware_ta21_parent');
    else sp = sp.from('view_malware_ta21');
    sp = sp.select('*', { count: 'exact', head: false });
    if (!coChuDich) sp = sp.is('parent', null);
    if (main_type) sp = sp.eq('main_type', main_type ? main_type : null);

    if (is_click_trong_ngay) {
      sp = from
        ? sp.gte('created_at', this.formatDateCustom(from))
        : sp.gte(
            'created_at',
            this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
          );
      sp = to
        ? sp.lte('created_at', this.formatDateCustom(to))
        : sp.lte('created_at', this.endOfDayFormatted(new Date()));
    }

    if (searchText) {
      sp.ilike('search_text', '%' + searchText?.trim() + '%');
    }
    if (coChuDich) sp = sp.order('id');
    else sp = sp.order('created_at', { ascending: false, nullsFirst: false });
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

  formatDateTime(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  startOfDayFormatted(date: any) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return this.formatDateTime(start);
  }

  endOfDayFormatted(date: any) {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // Đặt giờ, phút, giây và mili-giây về 23:59:59.999
    return this.formatDateTime(end);
  }

  eightHourOfDayFormatted(date: any) {
    const start = new Date(date);
    start.setHours(8, 0, 0, 0);
    return this.formatDateTime(start);
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
          ? this.formatDateCustom(from)
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _end: end
          ? this.formatDateCustom(end)
          : this.endOfDayFormatted(new Date()),
      })
      .select('*');

    const b = await sp;
    return b.error ? [] : b.data;
  }

  getSp() {
    return this.supabase.schema('public');
  }

  getSpBtth() {
    return this.supabase.schema('btth');
  }

  /*
  source_mac: any,
    main_type: string,
    sub_type: any,
    alert_type: string,
    loploi: any = null,
    page_index: number = 1,
    page_size: number = 10,
    from: any = null,
    end: any = null,
  */
  async getDanhSachCanhBao(
    source_mac: any = null,
    main_type: any,
    sub_type: any,
    column_type: any, // MALWARE, INTERNET, BLACKDOMAIN, HUNTING
    loploi: any = null,
    lopbien: any = null,
    searchText: any = null,
    alert_source: any = null,
    xu_ly: any = null,
    page: number = 1,
    limit: number = 5,
    from: any = null,
    to: any = null,
  ): Promise<any> {
    const { data, error } = await this.supabase
      .schema('btth')
      .rpc('su_co_security_list', {
        _is_lamsach: false,
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : '728',
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _column_type: column_type ? column_type : null,
        _search_text: searchText ? searchText?.trim() : null,
        _alert_source: alert_source ? alert_source : null,
        _xuly: xu_ly ? xu_ly : null,
        _from: from
          ? formatDate(from, 'yyyy-MM-dd HH:mm:ss', 'en-US')
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: to
          ? formatDate(to, 'yyyy-MM-dd HH:mm:ss', 'en-US')
          : this.endOfDayFormatted(new Date()),
        _limit: limit,
        _page: page,
      });
    if (error) {
      return null;
    } else {
      return {
        items: data[0]?.data?.map((item: any) => item?.data) || [],
        total: data[0]?.total || 0,
        page_index: data[0]?.page || 1,
        page_size: data[0]?.limit || limit,
      };
    }
  }

  async getSuCoMKNCat(
    main_type: string,
    sub_type: any,
    loploi: any = null,
    lopbien: any = null,
    column_type: any = null,
    from: any = null,
    to: any = null,
  ): Promise<any> {
    if (!sub_type) {
      return [];
    }
    let sp = this.supabase
      .schema('btth')
      .rpc('su_co_mkn_cat', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : null,
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _column_type: column_type ? column_type : null,
        _from: from
          ? this.formatDateCustom(from)
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: to
          ? this.formatDateCustom(to)
          : this.endOfDayFormatted(new Date()),
      })
      .select('*');

    let b = await sp;
    return b.error ? [] : b.data[0];
  }

  async getSuCoSecurityCat(
    main_type: string,
    sub_type: any,
    loploi: any = null,
    lopbien: any = null,
    column_type: any = null,
    from: any = null,
    to: any = null,
  ): Promise<any> {
    if (!sub_type) {
      return [];
    }
    let sp = this.supabase
      .schema('btth')
      .rpc('su_co_security_cat', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : null,
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _column_type: column_type ? column_type : null,
        _from: from
          ? this.formatDateCustom(from)
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: to
          ? this.formatDateCustom(to)
          : this.endOfDayFormatted(new Date()),
      })
      .select('*');

    let b = await sp;
    return b.error ? [] : b.data[0];
  }

  // Popup khi bấm vào Router

  async getSuCoSecurityCatSecond(
    main_type: string,
    sub_type: any,
    loploi: any = null,
    lopbien: any = null,
    type: any = null,
    from: any = null,
    to: any = null,
  ): Promise<any> {
    let sp = this.supabase
      .schema('btth')
      .rpc('f_count_su_co_security', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : null,
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _type: type ? type : null,
        _from: from ? from : null,
        _to: to ? to : null,
      })
      .select('*');

    let b = await sp;
    return b.error ? [] : b.data;
  }

  async getF_Attt_Enp_TrienKhai(
    main_type: string,
    sub_type: any,
    loploi: any = null,
    lopbien: any = null,
    type: any = null,
    from: any = null,
    to: any = null,
  ): Promise<any> {
    let sp = this.supabase
      .schema('btth')
      .rpc('f_attt_enp_tk', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : null,
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _type: type ? type : null,
        _from: from ? from : null,
        _to: to ? to : null,
      })
      .select('*');

    let b = await sp;
    return b.error ? [] : b.data;
  }

  async getF_Attt_Enp_Dinhdanh(
    main_type: string,
    sub_type: any,
    loploi: any = null,
    lopbien: any = null,
    type: any = null,
    from: any = null,
    to: any = null,
  ): Promise<any> {
    let sp = this.supabase
      .schema('btth')
      .rpc('f_attt_enp_dinhdanh', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : null,
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _type: type ? type : null,
        _from: from ? from : null,
        _to: to ? to : null,
      })
      .select('*');

    let b = await sp;
    return b.error ? [] : b.data;
  }

  //Popup 2nd
  async getSuCoMKNCatSecond(
    main_type: string,
    sub_type: any,
    loploi: any = null,
    lopbien: any = null,
    type: any = null,
    from: any = null,
    to: any = null,
  ): Promise<any> {
    let sp = this.supabase
      .schema('btth')
      .rpc('f_count_su_co', {
        _main_type: main_type ? main_type : null,
        _path: sub_type ? sub_type : null,
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _type: type ? type : null,
        _from: from ? from : null,
        _to: to ? to : null,
      })
      .select('*');

    let b = await sp;
    return b.error ? [] : b.data;
  }

  async getUnit() {
    let sp: any = await this.supabase.schema('btth');
    sp = sp.from('view_unit').select('*');
    var b: any = await sp;
    return b.error ? [] : b.data;
  }

  async getThongKeBieuDoTronTangGiamNetworkDevicePopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'ROUTER',
    loploi: any = null,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_device_v2');
    sp = sp.select('is_deleted,count()');
    if (sub_type)
      sp.or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (col_type) sp.eq('type', col_type);
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loploi', loploi);
    if (from) {
      sp = sp.gte('create_at', this.formatDateCustom(from));
    }
    if (to) {
      sp = sp.lte('create_at', this.formatDateCustom(to));
    }
    const resp: any = await sp;
    return resp.data || [];
  }

  async getThongKeBieuDoCotTangGiamNetworkDevicePopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'ROUTER',
    loploi: any = null,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_device_v2');
    sp = sp.select('is_deleted,source,count()');
    if (sub_type)
      sp.or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (col_type) sp.eq('type', col_type);
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loploi', loploi);
    if (from) {
      sp = sp.gte('create_at', this.formatDateCustom(from));
    }
    if (to) {
      sp = sp.lte('create_at', this.formatDateCustom(to));
    }
    const resp: any = await sp;
    return resp.data || [];
  }

  async getDanhSachTangGiamNetworkDevicePopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'ROUTER',
    loploi: any = null,
    search_text: any = null,
    is_deleted: string = '',
    source: string = '',
    from: any = null,
    to: any = null,
    page_index: number = 1,
    page_size: number = 5,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_device_v2');
    sp = sp.select('*', { count: 'exact', head: false });
    if (sub_type)
      sp.or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (col_type) sp.eq('type', col_type);
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loploi', loploi);
    if (from) {
      sp = sp.gte('create_at', this.formatDateCustom(from));
    }
    if (to) {
      sp = sp.lte('create_at', this.formatDateCustom(to));
    }
    if (search_text) {
      sp.ilike('search_text', '%' + search_text?.trim() + '%');
    }
    if (source) {
      sp = sp.eq('source', source);
    }
    if (is_deleted == 'true') {
      sp.is('is_deleted', true);
    }
    if (is_deleted == 'false') {
      sp.is('is_deleted', false);
    }

    sp = sp.order('create_at', { ascending: false, nullsFirst: false });
    let b = await sp.range(
      (page_index - 1) * page_size,
      page_index * page_size - 1,
    );
    return b.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: b.count,
          items: b.data,
          page_index,
          page_size,
        };
  }

  async getThongKeBieuDoTronPopupMiddPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'ROUTER',
    loploi: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_device_v2');
    sp = sp.select('status,count()');
    if (sub_type)
      sp.or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (col_type) sp.eq('type', col_type);
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loploi', loploi);
    const resp: any = await sp;
    return resp.data || [];
  }

  async getThongKeBieuDoCotFirewallPopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    loploi: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_device_v2').select('status,sources,count()');
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loploi', loploi);
    sp = sp.eq('type', 'FIREWALL');
    if (sub_type)
      sp = sp.or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    let b = await sp;
    let resp = b.data || [];
    return resp;
  }

  async getDanhSachThietBiPopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'ROUTER',
    loploi: any = null,
    search_text: any = null,
    status_type: string = '',
    source: string = '',
    category: any = null,
    page_index: number = 1,
    page_size: number = 5,
  ) {
    let sp: any = await this.supabase.schema('btth');
    sp = sp
      .from('view_device_v2')
      .select('*', { count: 'exact', head: false })
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (main_type) sp = sp.eq('main_type', main_type);
    if (col_type) sp.eq('type', col_type);
    if (loploi) sp.eq('loploi', loploi);
    if (category) sp.eq('category', category);

    if (search_text) {
      sp.ilike('search_text', '%' + search_text?.trim() + '%');
    }
    if (status_type) {
      sp.eq('status', status_type);
    }
    if (source) {
      sp.contains('sources', [source]);
    }
    sp = sp.order('status');
    sp = sp.order('last_active', { ascending: false, nullsFirst: false });
    let b = await sp.range(
      (page_index - 1) * page_size,
      page_index * page_size - 1,
    );
    return b.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: b.count,
          items: b.data,
          page_index,
          page_size,
        };
  }

  async getThongKeBieuDoCotRouter(
    main_type: string = '',
    sub_type = '728',
    loploi = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_device_v2');
    sp = sp.select('status,sources,count()');
    if (sub_type)
      sp.or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    sp = sp.eq('type', 'ROUTER');
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loploi', loploi);
    const resp: any = await sp;
    return resp.data || [];
  }

  async getBieuDoCotNguonSwitch(
    main_type: string = '',
    sub_type = '728',
    loploi = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_device_v2').select('status,sources,count()');
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loploi', loploi);
    sp = sp.eq('type', 'SWITCH');
    if (sub_type)
      sp = sp.or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    let b = await sp;
    let resp = b.data || [];
    return resp;
  }

  // pop x02 cho ENDPOINT - Thiet bi dau cuoi
  // btth.phanloaiendpoint(_main_type "MAIN_TYPE", _sub_type ltree, _loploi text)
  async getBieuDoBarEndPointDevice(
    main_type: any = null,
    sub_type = '728',
    loploi = null,
    col_type = 'SERVER',
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp
      .rpc('phanloaiendpoint', {
        _main_type: main_type || null,
        _sub_type: sub_type,
        _loploi: loploi,
        _col_type: col_type,
      })
      .select('*');
    let b = await sp;
    if (b.error) console.error(b.error);
    var resp = b.data || [];
    return resp;
  }

  // Pop 201
  async getThongKeBieuDoTronEndPointMidPanel(
    main_type: any = null,
    sub_type: string = '728',
    col_type: string = 'CLIENT',
    loploi: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_endpoint_v2');
    sp = sp
      .select('not_online,count()')
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    // .or('unit_path_text.eq.' + sub_type)
    //.or('unit_path_text.like.' + sub_type + '.%')
    if (main_type) sp = sp.eq('main_type', main_type);
    if (col_type) sp.eq('type', col_type);
    if (loploi) sp.eq('loploi', loploi);

    const resp: any = await sp;
    if (resp.error) {
      console.error(resp.error);
      return [];
    }
    resp.data.forEach((el: any) => {
      el.status = el.not_online ? false : true;
    });
    return resp.data || [];
  }

  async getThongKeBieuDoCotEndPointPanel(
    main_type: any = null,
    sub_type: string = '728',
    col_type: any = 'SERVER',
    loploi: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.rpc('view_endpoint_tree_count', {
      _main_type: main_type ? main_type : null,
      _sub_type: sub_type,
      _col_type: col_type,
      _loploi: loploi ? loploi : null,
      _lopbien: null,
      _auto: true,
    });
    sp = sp.select('*');
    const resp: any = await sp;
    if (resp.error) return [];
    let data: any = {};
    resp.data.forEach((el: any) => {
      var kk = el.loploi;
      data[kk] = data[kk] || { name: kk, connect: 0, disconnect: 0 };
      data[kk]['disconnect'] += el.count_not_online;
      data[kk]['connect'] += el.total - el.count_not_online;
    });
    return Object.values(data);
  }

  async getTableEndPoindMidPanel(
    main_type: any = null,
    sub_type: string = '728',
    col_type: any = 'SERVER',
    loploi: any = null,
    sources: any = [],
    search_text: string = '',
    status_type: string = '',
    page_index: number = 1,
    page_size: number = 5,
  ) {
    let sp: any = await this.supabase.schema('btth');
    sp = sp
      .from('view_endpoint_v2')
      .select('*', { count: 'exact', head: false })
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );

    if (main_type) sp = sp.eq('main_type', main_type);
    if (col_type) sp.eq('type', col_type);
    if (loploi) sp.eq('loploi', loploi);
    if (sources.length > 0) {
      sp = sp.contains('sources', sources);
    }
    if (search_text) {
      sp.ilike('search_text', '%' + search_text?.trim() + '%');
    }

    if (status_type == 'true') {
      sp.is('not_online', true);
    }
    if (status_type == 'false') {
      sp.is('not_online', false);
    }
    sp = sp.order('not_online', { ascending: false });
    sp = sp.order('last_active', { ascending: false, nullsFirst: false });
    var b = await sp.range(
      (page_index - 1) * page_size,
      page_index * page_size - 1,
    );
    return b.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: b.count,
          items: b.data,
          page_index,
          page_size,
        };
  }

  // Pop 301
  async getThongKeBieuDoTronTangGiamEndPointMidPanel(
    main_type: any = null,
    sub_type: string = '728',
    col_type: string = 'CLIENT',
    loploi: any = null,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_endpoint_v2');
    sp = sp
      .select('count()')
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (from) {
      sp = sp.gte('create_at', this.formatDateCustom(from));
    }
    if (to) {
      sp = sp.lte('create_at', this.formatDateCustom(to));
    }
    if (main_type) sp = sp.eq('main_type', main_type);
    if (col_type) sp.eq('type', col_type);
    if (loploi) sp.eq('loploi', loploi);

    // is_deleted alway is false

    const resp: any = await sp;
    if (resp.error) {
      console.error(resp.error);
      return [];
    }
    // resp.data.forEach((el: any) => {
    //   el.status = el.not_online ? false : true;
    // });
    return resp.data || [];
  }

  async getThongKeBieuDoCotTangGiamEndPointMidPanel(
    main_type: any = null,
    sub_type: string = '728',
    col_type: string = 'CLIENT',
    loploi: any = null,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_endpoint_v2');
    sp = sp
      .select('sources,count()')
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (from) {
      sp = sp.gte('create_at', this.formatDateCustom(from));
    }
    if (to) {
      sp = sp.lte('create_at', this.formatDateCustom(to));
    }
    if (main_type) sp = sp.eq('main_type', main_type);
    if (col_type) sp.eq('type', col_type);
    if (loploi) sp.eq('loploi', loploi);

    // is_deleted alway is false

    const resp: any = await sp;
    if (resp.error) {
      console.error(resp.error);
      return [];
    }
    return resp.data || [];
  }

  async getDanhSachTangGiamEndPointMidPanel(
    main_type: any = null,
    sub_type: string = '728',
    col_type: string = 'CLIENT',
    loploi: any = null,
    source: any = '',
    search_text: string = '',
    from: any = null,
    to: any = null,
    page_index: number = 1,
    page_size: number = 5,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_endpoint_v2');
    sp = sp
      .select('*', { count: 'exact', head: false })
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (from) {
      sp = sp.gte('create_at', this.formatDateCustom(from));
    }
    if (to) {
      sp = sp.lte('create_at', this.formatDateCustom(to));
    }
    if (main_type) sp = sp.eq('main_type', main_type);
    if (col_type) sp.eq('type', col_type);
    if (loploi) sp.eq('loploi', loploi);

    if (source) {
      sp = sp.contains('sources', [source]);
    }
    if (search_text) {
      sp.ilike('search_text', '%' + search_text?.trim() + '%');
    }
    sp = sp.order('first_install_ts', { ascending: false, nullsFirst: false });

    let b = await sp.range(
      (page_index - 1) * page_size,
      page_index * page_size - 1,
    );
    return b.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: b.count,
          items: b.data,
          page_index,
          page_size,
        };
  }

  async getBieuDoTronUDDVPopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'PORTAL',
    loploi: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_service');
    sp = sp
      .select('status,count()')
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (col_type) sp.eq('type', col_type);
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loi', loploi);

    const resp: any = await sp;
    if (resp.error) {
      console.error(resp.error);
      return [];
    }
    resp.data.forEach((el: any) => {
      el.status = el.status == 'up' ? true : false;
    });
    return resp.data;
  }

  async getBIeuDoCotUDDVPopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'PORTAL',
    loploi: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_service');
    sp = sp
      .select('loi,status,count()')
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (main_type) sp = sp.eq('main_type', main_type);
    if (col_type) sp.eq('type', col_type);
    if (loploi) sp.eq('loi', loploi);
    const resp: any = await sp;
    if (resp.error) {
      console.error(resp.error);
      return [];
    }
    let data: any = {};
    resp.data.forEach((el: any) => {
      var kk = el.loi;
      data[kk] = data[kk] || { connect: 0, disconnect: 0, name: kk };
      if (el.status == 'up') data[kk]['connect'] += el.count;
      else data[kk]['disconnect'] += el.count;
    });
    return Object.values(data);
  }

  async getTableUDDVPopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'PORTAL',
    loploi: any = null,
    search_text: string = '',
    status_type: string = '',
    page_index: number = 1,
    page_size: number = 5,
  ) {
    let sp: any = await this.supabase.schema('btth');
    sp = sp
      .from('view_service')
      .select('*', { count: 'exact', head: false })
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (main_type) sp = sp.eq('main_type', main_type);
    if (col_type) sp.eq('type', col_type);
    if (loploi) sp.eq('loi', loploi);
    if (search_text) {
      sp.ilike('search_text', '%' + search_text?.trim() + '%');
    }
    if (status_type) {
      sp.eq('status', status_type);
    }

    sp = sp.order('status');
    sp = sp.order('last_active', { ascending: false, nullsFirst: false });

    var b = await sp.range(
      (page_index - 1) * page_size,
      page_index * page_size - 1,
    );
    return b.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: b.count,
          items: b.data,
          page_index,
          page_size,
        };
  }

  async getBieuDoTronUDDVTangGiamPopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'PORTAL',
    loploi: any = null,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_service');
    sp = sp
      .select('count()')
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (col_type) sp.eq('type', col_type);
    if (main_type) sp = sp.eq('main_type', main_type);
    if (loploi) sp.eq('loi', loploi);
    if (from) {
      sp = sp.gte('create_at', this.formatDateCustom(from));
    }
    if (to) {
      sp = sp.lte('create_at', this.formatDateCustom(to));
    }
    const resp: any = await sp;
    if (resp.error) {
      console.error(resp.error);
      return [];
    }
    return resp?.data || [];
  }

  async getBIeuDoCotUDDVTangGiamPopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'PORTAL',
    loploi: any = null,
    from: any = null,
    to: any = null,
  ) {
    let sp: any = this.supabase.schema('btth');
    sp = sp.from('view_service');
    sp = sp
      .select('loi,count()')
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (main_type) sp = sp.eq('main_type', main_type);
    if (col_type) sp.eq('type', col_type);
    if (loploi) sp.eq('loi', loploi);
    if (from) {
      sp = sp.gte('create_at', this.formatDateCustom(from));
    }
    if (to) {
      sp = sp.lte('create_at', this.formatDateCustom(to));
    }
    const resp: any = await sp;
    if (resp.error) {
      console.error(resp.error);
      return [];
    }
    // let data: any = {};
    // resp.data.forEach((el: any) => {
    //   var kk = el.loi;
    //   data[kk] = data[kk] || { connect: 0, disconnect: 0, name: kk };
    //   if (el.status == 'up') data[kk]['connect'] += el.count;
    //   else data[kk]['disconnect'] += el.count;
    // });
    // return Object.values(data);
    return resp?.data || [];
  }

  async getDanhSachUDDVTangGiamPopupMidPanel(
    main_type: any = null,
    sub_type: any = '728',
    col_type: string = 'PORTAL',
    loploi: any = null,
    search_text: string = '',
    status_type: string = '',
    from: any = null,
    to: any = null,
    page_index: number = 1,
    page_size: number = 5,
  ) {
    let sp: any = await this.supabase.schema('btth');
    sp = sp
      .from('view_service')
      .select('*', { count: 'exact', head: false })
      .or(
        'unit_path_text.eq.' +
          sub_type +
          ',' +
          'unit_path_text.like.' +
          sub_type +
          '.%',
      );
    if (main_type) sp = sp.eq('main_type', main_type);
    if (col_type) sp.eq('type', col_type);
    if (loploi) sp.eq('loi', loploi);
    if (search_text) {
      sp.ilike('search_text', '%' + search_text?.trim() + '%');
    }
    if (status_type) {
      sp.eq('status', status_type);
    }
    if (from) {
      sp = sp.gte('create_at', this.formatDateCustom(from));
    }
    if (to) {
      sp = sp.lte('create_at', this.formatDateCustom(to));
    }
    sp = sp.order('status');
    sp = sp.order('last_active', { ascending: false, nullsFirst: false });

    let b = await sp.range(
      (page_index - 1) * page_size,
      page_index * page_size - 1,
    );
    return b.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: b.count,
          items: b.data,
          page_index,
          page_size,
        };
  }

  //Kết thúc

  formatDateCustom(date: any) {
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
  }

  async getDanhSachHeThongMatKetNoi(
    main_type: any,
    sub_type: any,
    column_type: any, // device, service, server_monitor
    loploi: any = null,
    lopbien: any = null,
    searchText: any = null,
    xuly: any = null,
    page: number = 1,
    limit: number = 10,
    from: any = null,
    to: any = null,
  ): Promise<any> {
    // page= 1; limit= 10; loploi= null; lopbien= null;main_type = 'QS';sub_type='728.724'; // debug
    const { data, error } = await this.supabase
      .schema('btth')
      .rpc('su_co_mkn_list', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : '728',
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _column_type: column_type ? column_type : null,
        _xuly: xuly ? xuly : null,
        _from: from
          ? this.formatDateCustom(from)
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: to
          ? this.formatDateCustom(to)
          : this.endOfDayFormatted(new Date()),
        _limit: limit,
        _page: page,
        _search_text: searchText ? searchText : null,
      });
    if (error) {
      return null;
    } else {
      return {
        items: data[0]?.data?.map((item: any) => item?.data) || [],
        total: data[0]?.total || 0,
        page_index: data[0]?.page || 1,
        page_size: data[0]?.limit || limit,
      };
    }
  }

  // đã sửa, nhỏ nổi, lớn chìm
  async getVuKhiTrangBi(parent_id: any, page_index: number, page_size: number) {
    var sp = this.supabase
      .schema('btth')
      .from('vktb_1')
      .select('name,main_type,level,status,id,parent_id,sort')
      .order('sort');
    if (parent_id == null) {
      sp = sp.is('parent_id', null);
    } else sp = sp.eq('parent_id', parent_id);
    var resp = await sp;

    if (resp.error) {
      return [];
    } else {
      if (parent_id) {
        return {
          total: resp.data.length || 0,
          items: resp.data.slice(
            (page_index - 1) * page_size,
            page_index * page_size - 1,
          ),
          page_index,
          page_size,
        };
      }
      let groupedData = resp.data.reduce((result: any, item: any) => {
        // Find or create level group
        let levelGroup: any = result.find(
          (level: any) => level.level === item.level,
        );
        if (!levelGroup) {
          levelGroup = { level: item.level, list: [] };
          result.push(levelGroup);
        }
        // Find or create main_type group within the level group
        let mainTypeGroup = levelGroup.list.find(
          (mainType: any) => mainType.main_type === item.main_type,
        );
        if (!mainTypeGroup) {
          mainTypeGroup = { main_type: item.main_type, list: [] };
          levelGroup.list.push(mainTypeGroup);
        }
        // Add the item to the main_type group
        mainTypeGroup.list.push(item);
        return result;
      }, []);

      let groupByKey: any = {};
      groupedData.forEach((item: any) => {
        let listKey: any = {};
        let lstArr: any[] = [];
        item.list.forEach((e: any) => {
          listKey[e.main_type] = { main_type: e.main_type, list: e.list };
        });
        lstArr.push(listKey['QS'] || {});
        lstArr.push(listKey['INT'] || {});
        lstArr.push(listKey['CD'] || {});
        groupByKey[item.level] = { list: lstArr, level: item.level };
        // item.list.sort(this.compareNumbers);
      });
      let data = [];
      data.push(groupByKey['Chiến lược'] || {});
      data.push(groupByKey['Chiến dịch'] || {});
      data.push(groupByKey['Chiến thuật'] || {});
      console.log(data);
      return data;
    }
  }

  // tac chien mang - t586
  async t5_dulieuthuthap() {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('t5_dulieuthuthap');
    if (res.error) console.error('err:', res.error);
    else console.log('data_thuthap - Done');
    return res?.error ? [] : res?.data;
  }

  async t5_baocao() {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('t5_baocao');
    if (res.error) console.error('err:', res.error);
    else console.log('data_baocao - Done');
    return res?.error ? [] : res?.data;
  }

  async t5_kythuattacchien() {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('t5_kythuattacchien');
    if (res.error) {
      console.error('err:', res.error);
      return [];
    } else {
      //  nhóm theo unit_name và cộng dồn count
      const groupedData: any = {};

      res.data.forEach((item: any) => {
        if (!groupedData[item.unit_name]) {
          groupedData[item.unit_name] = {
            unit_name: item.unit_name,
            count: 0,
            weapons: {},
          };
        }
        groupedData[item.unit_name].count += item.count;

        if (!groupedData[item.unit_name].weapons[item.weapon_name]) {
          groupedData[item.unit_name].weapons[item.weapon_name] = 0;
        }
        groupedData[item.unit_name].weapons[item.weapon_name] += item.count;
      });

      const result = Object.values(groupedData);

      return result;
    }
  }

  // async t5_lucluong() {
  //   var sp: any=  this.supabase.schema('public');
  //   var res= await sp.rpc('t5_lucluong')
  //   if(res.error) console.error('err:', res.error);
  //   else console.log('data_lucluong:', res.data);
  //   return res?.error ? [] : res?.data;
  // }

  //   async t5_lucluong() {
  //     var sp: any = this.supabase.schema('public');
  //     var res = await sp.rpc('t5_lucluong');
  //     if (res.error) {
  //         console.error('err:', res.error);
  //         return [];
  //     } else {
  //         console.log('data_lucluong:', res.data);
  //         const groupData = (data: any[]) => {
  //             const grouped: { [key: string]: any } = {};

  //             data.forEach(({ unit_name, force_name, force_number }) => {
  //                 if (!grouped[unit_name]) {
  //                     grouped[unit_name] = { x: unit_name };
  //                 }
  //                 if (!grouped[unit_name][force_name]) {
  //                     grouped[unit_name][force_name] = 0;
  //                 }
  //                 grouped[unit_name][force_name] += force_number;
  //             });

  //             return Object.values(grouped);
  //         };

  //         const groupedData = groupData(res.data);
  //         console.log('groupedData:', groupedData);

  //         return groupedData;
  //     }
  // }

  async t5_lucluong() {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('t5_lucluong');
    if (res.error) {
      console.error('err:', res.error);
      return { data: [], length: 0 };
    } else {
      console.log('data_lucluong - Done');
      const groupData = (data: any[]) => {
        const grouped: { [key: string]: any } = {};
        data.forEach(({ unit_name, force_name, force_number }) => {
          if (!grouped[unit_name]) {
            grouped[unit_name] = { x: unit_name };
          }
          const currentGroup = grouped[unit_name];
          const currentIndex = Object.keys(currentGroup).length - 1;
          currentGroup[`y${currentIndex}`] = force_number;
        });
        return Object.values(grouped);
      };
      const groupedData = groupData(res.data);
      return { data: groupedData, length: res.data.length };
    }
  }

  async t5_muctieu() {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('t5_muctieu');
    if (res.error) console.error('err:', res.error);
    else console.log('data_muctieu - Done');
    const filteredData = res?.data?.filter(
      (item: any) => item.unit_name !== null,
    );
    return res?.error ? [] : filteredData;
  }

  async getThongKeBieuDoPieFMS() {
    try {
      const { data, error } = await this.supabase
        .schema('btth')
        .rpc('get_status_fms_fmc_count');

      if (error) {
        console.error('Error fetching data:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }

  async getThongKeBieuDoPieTa21(main_type: string) {
    try {
      const { data, error } = await this.supabase
        .schema('btth')
        .rpc('get_server_ta21_count_by_status', {
          main_type_input: main_type,
        });

      if (error) {
        console.error('Error fetching data:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }

  async getThongKeBieuDoPieMMS() {
    try {
      const { data, error } = await this.supabase
        .schema('btth')
        .rpc('get_status_mms_count');

      if (error) {
        console.error('Error fetching data:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }

  async getDanhSachServerMMS(
    page_index: number = 1,
    page_size: number = 5,
    searchText?: string,
    xuLyType?: string,
  ) {
    let sp: any = await this.supabase.schema('btth');
    sp = sp
      .from('server_fmc')
      .select('*', { count: 'exact', head: false })
      .eq('main_type', 'CD');
    const { data, error, count } = await this.supabase
      .schema('btth')
      .from('server_fmc')
      .select('*', { count: 'exact', head: true })
      .ilike('name', '%FMC%')
      .eq('status', 'down')
      .eq('main_type', 'CD');
    if (searchText) {
      sp = sp.ilike('name', `%${searchText}%`);
    }
    if (xuLyType !== '' && xuLyType !== undefined) {
      console.log('xuLyType', xuLyType);
      if (xuLyType == 'Mất kết nối') {
        xuLyType = 'down';
      } else {
        xuLyType = 'up';
      }
      sp = sp.eq('status', xuLyType); // Replace 'xu_ly_type_field' with the actual field name for xuLyType
    }
    const rangeStart = (page_index - 1) * page_size;
    const rangeEnd = page_index * page_size - 1;

    const result = await sp.range(rangeStart, rangeEnd);

    return result.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
          fmc_down: count,
        }
      : {
          total: result.count,
          items: result.data,
          page_index,
          page_size,
          fmc_down: count,
        };
  }

  async getDanhSachServerFmc(
    page_index: number = 1,
    page_size: number = 5,
    status?: string,
    searchText?: string,
    capType?: string,
    xuLyType?: string,
  ) {
    let sp: any = await this.supabase.schema('btth');
    if (status) {
      sp = sp
        .from('server_fmc_with_unit')
        .select('*', { count: 'exact', head: false })
        .eq('main_type', 'QS')
        .eq('status', status)
        .order('status', { ascending: true })
        .order('last_up', { ascending: true });
    } else {
      sp = sp
        .from('server_fmc_with_unit')
        .select('*', { count: 'exact', head: false })
        .eq('main_type', 'QS')
        .order('status', { ascending: true })
        .order('last_up', { ascending: true });

      if (searchText !== '' && searchText !== undefined) {
        console.log('Search', searchText);
        sp = sp.or(
          `unit_name_manager_parent.ilike.%${searchText}%,unit_name_manager.ilike.%${searchText}%`,
        );
      }
      if (capType !== '' && capType !== undefined) {
        if (capType == 'Cấp 1') {
          capType = 'FMS-Tổng';
        } else if (capType == 'Cấp 2') {
          capType = 'FMS-V';
        } else if (capType == 'Cấp 3') {
          capType = 'FMS';
        } else {
          capType = 'FMC';
        }

        if (capType === 'FMS') {
          // Match entries containing 'FMS' but not 'FMS-V'
          sp = sp
            .ilike('name', `%${capType}%`)
            .not('name', 'ilike', '%FMS-V%')
            .not('name', 'ilike', '%FMS-Tổng%')
            .not('name', 'ilike', '%602%');
        } else {
          sp = sp.ilike('name', `%${capType}%`);
        }
      }
      if (xuLyType !== '' && xuLyType !== undefined) {
        console.log('xuLyType', xuLyType);
        if (xuLyType == 'Mất kết nối') {
          xuLyType = 'down';
        } else {
          xuLyType = 'up';
        }
        sp = sp.eq('status', xuLyType); // Replace 'xu_ly_type_field' with the actual field name for xuLyType
      }
    }
    const { data, error, count } = await this.supabase
      .schema('btth')
      .from('server_fmc')
      .select('*', { count: 'exact', head: true })
      .ilike('name', '%FMC%')
      .eq('status', 'down')
      .eq('main_type', 'QS');
    const rangeStart = (page_index - 1) * page_size;
    const rangeEnd = page_index * page_size - 1;

    const result = await sp.range(rangeStart, rangeEnd);

    //===============return data======================
    const arrayUid = result.data.map((item: any) => item.uuid);
    const statusServer = await this.supabase
      .schema('btth')
      .rpc('kfsc_server_monitor', {
        _array_id: arrayUid,
      });
    const mergedData = result.data.map((item: any) => {
      const matchingStatus = statusServer?.data[0]?.data?.find(
        (status: any) => status.sid === item.uuid,
      );
      return {
        ...item,
        matchingStatus,
        statusServer: matchingStatus
          ? matchingStatus.status
          : item.status == 'down'
          ? 'Chưa xử lý'
          : '',
      };
    });

    return result.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
          fmc_down: count,
        }
      : {
          total: result.count,
          items: mergedData,
          page_index,
          page_size,
          fmc_down: count,
        };
  }

  async getDanhSachServerTA21(
    page_index: number = 1,
    page_size: number = 8,
    status?: string,
    network?: string,
    searchText?: string,
    xuLyType?: string,
  ) {
    let sp: any = await this.supabase.schema('btth');
    if (status) {
      sp = sp
        .from('view_server')
        .select('*', { count: 'exact', head: false })
        .eq('status', status)
        .eq('main_type', network)
        .eq('type', 'ta21')
        .order('status', { ascending: true })
        .order('last_up', { ascending: true });
    } else {
      sp = sp
        .from('view_server')
        .select('*', { count: 'exact', head: false })
        .eq('type', 'ta21')
        .eq('main_type', network)
        .order('status', { ascending: true })
        .order('last_up', { ascending: true });
    }

    if (searchText !== '' && searchText !== undefined) {
      console.log('Search', searchText);
      sp = sp.or(
        `ip.ilike.%${searchText}%,unit_name_full.ilike.%${searchText}%`,
      );
    }
    if (xuLyType !== '' && xuLyType !== undefined) {
      if (xuLyType == 'Mất kết nối') {
        xuLyType = 'down';
      } else {
        xuLyType = 'up';
      }
      sp = sp.eq('status', xuLyType); // Replace 'xu_ly_type_field' with the actual field name for xuLyType
    }
    const { data, error, count } = await this.supabase
      .schema('btth')
      .from('view_server')
      .select('*', { count: 'exact', head: true });
    // .eq('status', 'down');
    const rangeStart = (page_index - 1) * page_size;
    const rangeEnd = page_index * page_size - 1;

    const result = await sp.range(rangeStart, rangeEnd);
    const arrayUid = result.data.map((item: any) => item.uuid);
    const statusServer = await this.supabase
      .schema('btth')
      .rpc('kfsc_server_monitor', {
        _array_id: arrayUid,
      });
    const mergedData = result.data.map((item: any) => {
      const matchingStatus = statusServer?.data[0]?.data?.find(
        (status: any) => status.sid === item.uuid,
      );

      return {
        ...item,
        matchingStatus,
        statusServer: matchingStatus
          ? matchingStatus.status
          : item.status == 'down'
          ? 'Chưa xử lý'
          : '',
      };
    });
    return result.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
          server_down: count,
        }
      : {
          total: result.count,
          items: mergedData,
          page_index,
          page_size,
          server_down: count,
        };
  }

  // async getDanhSachServerTA21(
  //   page_index: number = 1,
  //   page_size: number = 8,
  //   status?: string,
  //   network?: string,
  // ) {
  //   let sp: any = await this.supabase.schema('btth');
  //   if (status) {
  //     sp = sp
  //       .from('server_ta21')
  //       .select('*', { count: 'exact', head: false })
  //       .eq('status', status)
  //       .eq('main_type', network)
  //       .order('status', { ascending: true })
  //       .order('last_up', { ascending: true });
  //   } else {
  //     sp = sp
  //       .from('server_ta21')
  //       .select('*', { count: 'exact', head: false })
  //       .order('status', { ascending: true })
  //       .eq('main_type', network)
  //       .order('last_up', { ascending: true });
  //   }

  //   const { data, error, count } = await this.supabase
  //     .schema('btth')
  //     .from('server_ta21')
  //     .select('*', { count: 'exact', head: true })
  //     .eq('status', 'down');
  //   const rangeStart = (page_index - 1) * page_size;
  //   const rangeEnd = page_index * page_size - 1;

  //   const result = await sp.range(rangeStart, rangeEnd);
  //   console.log(sp);
  //   return result.error
  //     ? {
  //         total: 0,
  //         items: [],
  //         page_index,
  //         page_size,
  //         server_down: count,
  //       }
  //     : {
  //         total: result.count,
  //         items: result.data,
  //         page_index,
  //         page_size,
  //         server_down: count,
  //       };
  // }

  async getDanhSachServerNACS(
    page_index: number = 1,
    page_size: number = 8,
    status?: string,
    network?: string,
    searchText?: string,
    xuLyType?: string,
  ) {
    let sp: any = await this.supabase.schema('btth');
    if (status) {
      sp = sp
        .from('view_server')
        .select('*', { count: 'exact', head: false })
        .eq('status', status)
        .eq('main_type', network)
        .eq('type', 'nac')
        .order('status', { ascending: true })
        .order('last_up', { ascending: true });
    } else {
      sp = sp
        .from('view_server')
        .select('*', { count: 'exact', head: false })
        .eq('type', 'nac')
        .eq('main_type', network)
        .order('status', { ascending: true })
        .order('last_up', { ascending: true });
    }

    if (searchText !== '' && searchText !== undefined) {
      console.log('Search', searchText);
      sp = sp.or(
        `ip.ilike.%${searchText}%,unit_name_full.ilike.%${searchText}%`,
      );
    }
    if (xuLyType !== '' && xuLyType !== undefined) {
      if (xuLyType == 'Mất kết nối') {
        xuLyType = 'down';
      } else {
        xuLyType = 'up';
      }
      sp = sp.eq('status', xuLyType); // Replace 'xu_ly_type_field' with the actual field name for xuLyType
    }
    const { data, error, count } = await this.supabase
      .schema('btth')
      .from('view_server')
      .select('*', { count: 'exact', head: true });
    // .eq('status', 'down');
    const rangeStart = (page_index - 1) * page_size;
    const rangeEnd = page_index * page_size - 1;

    const result = await sp.range(rangeStart, rangeEnd);
    const arrayUid = result.data.map((item: any) => item.uuid);
    const statusServer = await this.supabase
      .schema('btth')
      .rpc('kfsc_server_monitor', {
        _array_id: arrayUid,
      });
    const mergedData = result.data.map((item: any) => {
      const matchingStatus = statusServer?.data[0]?.data?.find(
        (status: any) => status.sid === item.uuid,
      );

      return {
        ...item,
        matchingStatus,
        statusServer: matchingStatus
          ? matchingStatus.status
          : item.status == 'down'
          ? 'Chưa xử lý'
          : '',
      };
    });
    return result.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
          server_down: count,
        }
      : {
          total: result.count,
          items: mergedData,
          page_index,
          page_size,
          server_down: count,
        };
  }

  async getDanhSachServerFidelis(
    page_index: number = 1,
    page_size: number = 5,
    status?: string,
    network?: string,
    searchText?: string,
    xuLyType?: string,
  ) {
    let sp: any = await this.supabase.schema('btth');
    if (status) {
      sp = sp
        .from('view_server')
        .select('*', { count: 'exact', head: false })
        .eq('status', status)
        .eq('main_type', network)
        .eq('type', 'fidelis')
        .order('status', { ascending: true })
        .order('last_up', { ascending: true });
    } else {
      sp = sp
        .from('view_server')
        .select('*', { count: 'exact', head: false })
        .eq('type', 'fidelis')
        .eq('main_type', network)
        .order('status', { ascending: true })
        .order('last_up', { ascending: true });
    }
    if (searchText !== '' && searchText !== undefined) {
      console.log('Search', searchText);
      sp = sp.or(
        `ip.ilike.%${searchText}%,unit_name_full.ilike.%${searchText}%`,
      );
    }
    if (xuLyType !== '' && xuLyType !== undefined) {
      if (xuLyType == 'Mất kết nối') {
        xuLyType = 'down';
      } else {
        xuLyType = 'up';
      }
      sp = sp.eq('status', xuLyType); // Replace 'xu_ly_type_field' with the actual field name for xuLyType
    }
    const { data, error, count } = await this.supabase
      .schema('btth')
      .from('view_server')
      .select('*', { count: 'exact', head: true });
    // .eq('status', 'down');
    const rangeStart = (page_index - 1) * page_size;
    const rangeEnd = page_index * page_size - 1;

    const result = await sp.range(rangeStart, rangeEnd);
    const arrayUid = result.data.map((item: any) => item.uuid);
    const statusServer = await this.supabase
      .schema('btth')
      .rpc('kfsc_server_monitor', {
        _array_id: arrayUid,
      });
    const mergedData = result.data.map((item: any) => {
      const matchingStatus = statusServer?.data[0]?.data?.find(
        (status: any) => status.sid === item.uuid,
      );
      return {
        ...item,
        matchingStatus,
        statusServer: matchingStatus
          ? matchingStatus.status
          : item.status == 'down'
          ? 'Chưa xử lý'
          : '',
      };
    });
    return result.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
          server_down: count,
        }
      : {
          total: result.count,
          items: result.data,
          page_index,
          page_size,
          server_down: count,
        };
  }

  async getDanhSachThucHienNhiemVu(time?: string, condition?: string) {
    let sp: any = this.supabase.schema('btth');
    if (condition) {
      sp = sp
        .from('top_kqthuchiennv')
        .select('*', { count: 'exact', head: false });
    } else {
      sp = sp
        .from('top_kqthuchiennv_cacdonvi')
        .select('*', { count: 'exact', head: false });
    }

    if (condition == 'ngay') {
      sp = sp.eq('created_at', time).limit(1);
    }
    if (condition == 'tuan') {
      sp = sp.gt('created_at', time).limit(7);
    }
    sp = sp.order('created_at', { ascending: true, nullsFirst: false });
    const result = await sp;
    return result.data;
  }

  async getThongKeBieuDoPieNAC(main_type: string) {
    try {
      const { data, error } = await this.supabase
        .schema('btth')
        .rpc('get_view_server_count_by_status', {
          main_type_input: main_type,
          type_server: 'nac',
        });

      if (error) {
        console.error('Error fetching data:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }

  async getThongKeBieuDoPieFidelis(main_type: string) {
    try {
      const { data, error } = await this.supabase
        .schema('btth')
        .rpc('get_view_server_count_by_status', {
          main_type_input: main_type,
          type_server: 'fidelis',
        });

      if (error) {
        console.error('Error fetching data:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }

  async getDanhSachDuPhong86() {
    let sp: any = await this.supabase.schema('btth');

    sp = sp
      .from('view_top_dufong')
      .select('*', { count: 'exact', head: false })
      .order('id', { ascending: true });
    // const rangeStart = (page_index - 1) * page_size;
    // const rangeEnd = page_index * page_size - 1;

    const result = await sp;
    console.log(sp);
    return result.error
      ? {
          total: 0,
          items: [],
          // page_index,
          // page_size,
        }
      : {
          total: result.count,
          items: result.data,
          // page_index,
          // page_size,
        };
  }

  async getDanhSachDuPhong86_2() {
    let sp: any = await this.supabase.schema('btth');

    sp = sp
      .from('view_top_dufong_2')
      .select('*', { count: 'exact', head: false })
      .order('id', { ascending: true });

    const result = await sp.range(0, 10000);
    return result.error
      ? {
          total: 0,
          items: [],
        }
      : {
          total: result.count,
          items: result.data,
        };
  }

  async getDanhSachSSCD() {
    let sp: any = await this.supabase.schema('btth');

    sp = sp
      .from('top_sscd')
      .select('*', { count: 'exact', head: false })
      .order('sort', { ascending: true });

    const result = await sp.range(0, 10000);
    return result.error
      ? {
          total: 0,
          items: [],
        }
      : {
          total: result.count,
          items: result.data,
        };
  }

  async getDanhSachServerFmcByCap(main_type: string) {
    const { data, error } = await this.supabase
      .schema('btth')
      .rpc('get_server_count_by_cap', {
        main_type_input: main_type,
      });

    if (error) {
      console.error('Error fetching server count by cap:', error);
      return {
        total: 0,
        items: [],
      };
    }

    // Định dạng lại kết quả để trả về
    return {
      total: data.length,
      items: data,
    };
  }

  async getDanhSachServerTa21ByCap(main_type: string) {
    const { data, error } = await this.supabase.rpc(
      'get_server_ta21_status_count_by_type',
      {
        main_type_input: main_type,
      },
    );
    if (error) {
      console.error('Error fetching server count by cap:', error);
      return {
        total: 0,
        items: [],
      };
    }

    // Định dạng lại kết quả để trả về
    return {
      total: data.length,
      items: data,
    };
  }

  async getDanhSachServerNacsByRegion(main_type: string) {
    const { data, error } = await this.supabase
      .schema('btth')
      .rpc('get_status_count_by_loi', { p_main_type: main_type });

    if (error) {
      console.error('Error fetching server count by cap:', error);
      return {
        total: 0,
        items: [],
      };
    }

    // Format the result to return
    return {
      total: data.length,
      items: data,
    };
  }

  async getDanhSachServerFidelisByRegion(main_type: string) {
    const { data, error } = await this.supabase
      .schema('btth')
      .rpc('get_status_count_fidelis_by_loi', { p_main_type: main_type });

    if (error) {
      console.error('Error fetching server count by cap:', error);
      return {
        total: 0,
        items: [],
      };
    }

    // Format the result to return
    return {
      total: data.length,
      items: data,
    };
  }

  async getVersionQSCounts() {
    // Gọi hàm RPC từ Supabase
    const { data, error } = await this.supabase.rpc('get_version_qs_counts');

    if (error) {
      console.error('Error fetching server count by cap:', error);
      return {
        items: [],
      };
    }

    // Định dạng lại kết quả để trả về
    return {
      items: data,
    };
  }

  async getVersionCDCounts() {
    // Gọi hàm RPC từ Supabase
    const { data, error } = await this.supabase
      .schema('public')
      .rpc('get_version_cd_counts');

    if (error) {
      console.error('Error fetching version counts:', error);
      return {
        endpoint_fms: [],
        endpoint_ta21: [],
      };
    }

    // Định dạng lại kết quả để trả về
    const result = data?.reduce((acc: any, row: any) => {
      if (!acc[row.table_name]) {
        acc[row.table_name] = [];
      }
      acc[row.table_name].push({ x: row.version, y: row.count });
      return acc;
    }, {}) || { endpoint_fms: [], endpoint_ta21: [] };

    return result;
  }

  async getVersionINTCounts() {
    // Gọi hàm RPC từ Supabase
    const { data, error } = await this.supabase
      .schema('public')
      .rpc('get_version_internet_counts');

    return data;
  }

  // api detail SW by serial_number
  async getDetailTBMangBySerialNumber(serial_number: string) {
    let resp: any = null;
    let sp = await this.supabase
      .schema('btth')
      .from('view_device_v2')
      .select('*')
      .eq('serial_number', serial_number);
    if (sp.data) resp = sp.data[0];
    return resp;
  }

  async getDetailTBPortMangBySerialNumber(
    serial_number: string,
    page_index = 1,
    page_size = 5,
  ) {
    let sp = await this.supabase
      .schema('btth')
      .from('device_port')
      .select('*,endpoint:endpoint_nac!port(count())', { count: 'exact' })
      .eq('device_sn', serial_number)
      .range((page_index - 1) * page_size, page_index * page_size - 1);
    return sp.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: sp.count,
          items: sp.data,
          page_index,
          page_size,
        };
  }

  async getDanhSachMayTinhBySerialNumbers(
    serial_number: string,
    page_index = 1,
    page_size = 5,
  ) {
    // serial_number = 'CAT1031RKWX'; // debug
    let resp = await this.supabase
      .schema('btth')
      .from('view_endpoint_v2')
      .select('*', { count: 'exact' })
      .eq('device_sn', serial_number)
      .range((page_index - 1) * page_size, page_index * page_size - 1);

    return resp.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: resp.count,
          items: resp.data,
          page_index,
          page_size,
        };
  }

  async getDanhSachMaDocDaDuocLamSachBySerialNumber(
    serial_number: string,
    page_index = 1,
    page_size = 5,
  ) {
    // serial_number = 'CAT1031RKWX'; // debug
    let resp = await this.supabase
      .schema('btth')
      .from('view_security_event')
      .select('*', { count: 'exact' })
      .eq('device_sn', serial_number)
      .lt('warning_level', 3)
      .range((page_index - 1) * page_size, page_index * page_size - 1);
    return resp.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: resp.count,
          items: resp.data,
          page_index,
          page_size,
        };
  }

  async getDanhSachMaDocChuaDuocLamSachBySerialNumber(
    serial_number: string,
    page_index = 1,
    page_size = 5,
  ) {
    // serial_number = 'CAT1031RKWX'; // debug
    let resp = await this.supabase
      .schema('btth')
      .from('view_security_event')
      .select('*', { count: 'exact' })
      .eq('device_sn', serial_number)
      .gte('warning_level', 3)
      .range((page_index - 1) * page_size, page_index * page_size - 1);
    return resp.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: resp.count,
          items: resp.data,
          page_index,
          page_size,
        };
  }

  async getDetailClientServer(mac: string) {
    // mac = '00-00-00-00-02-7E' // debug
    let resp = await this.supabase
      .schema('btth')
      .from('view_endpoint_v2')
      .select('*')
      .eq('mac', mac);
    return resp.error ? {} : resp.data[0];
  }

  async getDanhSachDaDuocLamSachClientServer(
    mac: string,
    main_type: any = null,
    sub_type: any = '728',
    loploi: any = null,
    lopbien = null,
    from: any = null,
    to: any = null,
    page_index = 1,
    page_size = 5,
  ) {
    // mac = 'CAT1031RKWX'; // debug
    var sp: any = this.supabase
      .schema('btth')
      .from('view_security_event')
      .select('*', { count: 'exact' })
      .eq('source_mac', mac)
      .lt('warning_level', 3);

    if (from) {
      sp = sp.gte('last_active', this.formatDateCustom(from));
    }
    if (to) {
      sp = sp.lte('last_active', this.formatDateCustom(to));
    }

    if (main_type) sp = sp.eq('main_type', main_type ? main_type : null);
    if (loploi) sp = sp.eq('loi', loploi);
    if (lopbien) sp = sp.eq('bien', lopbien);
    sp = sp.order('last_active', { ascending: false });
    sp = sp.range((page_index - 1) * page_size, page_index * page_size - 1);

    let resp = await sp;
    return resp.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: resp.count,
          items: resp.data,
          page_index,
          page_size,
        };
  }

  // tab5
  async getDanhSachChuaDuocLamSachClientServer(
    mac: string,
    page_index = 1,
    page_size = 5,
  ) {
    let resp = await this.supabase
      .schema('btth')
      .from('view_security_event')
      .select('*', { count: 'exact' })
      .eq('source_mac', mac)
      .gte('warning_level', 3)
      .order('last_active', { ascending: false })
      .range((page_index - 1) * page_size, page_index * page_size - 1);
    return resp.error
      ? {
          total: 0,
          items: [],
          page_index,
          page_size,
        }
      : {
          total: resp.count,
          items: resp.data,
          page_index,
          page_size,
        };
  }

  async fetchAtCat(
    main_type: string,
    sub_type: string,
    loploi: string,
    lopbien: string,
    col_type: string,
    is_click_trong_ngay: boolean = false,
    from: string = '',
    to: string = '',
  ) {
    const { data, error } = await this.supabase
      .schema('btth')
      .rpc('at_mang_cat', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : '728',
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _coltype: col_type ? col_type : null,
        _from: !is_click_trong_ngay
          ? null
          : from
          ? this.formatDateCustom(from)
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: !is_click_trong_ngay
          ? null
          : to
          ? this.formatDateCustom(to)
          : this.endOfDayFormatted(new Date()),
      });
    if (error) {
      return null;
    } else {
      return data;
    }
  }

  // phan trang mang an toan, nang cao va co ban
  async fetchAtList(
    main_type: string,
    sub_type: string,
    loploi: string,
    lopbien: string,
    col_type: any = null,
    is_click_trong_ngay: boolean = false,
    text_search: string = '',
    _capdo: string = '', // Cấp 1, Cấp 2, Cấp 3 => select single option
    from: string = '',
    to: string = '',
    page: number = 1,
    limit: number = 5,
  ) {
    const { data, error } = await this.supabase
      .schema('btth')
      .rpc('at_mang_list', {
        _capdo: _capdo ? _capdo : null,
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : '728',
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _coltype: col_type ? col_type : null,
        _search_text: text_search ? text_search : null,
        _from: !is_click_trong_ngay
          ? null
          : from
          ? this.formatDateCustom(from)
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: !is_click_trong_ngay
          ? null
          : to
          ? this.formatDateCustom(to)
          : this.endOfDayFormatted(new Date()),
        _limit: limit,
        _page: page,
      });
    if (error) {
      console.error('Error fetching at_httt_cat:', error);
      return null;
    } else {
      return {
        items: data[0]?.data || [],
        total: data[0]?.total || 0,
        page_index: data[0]?.page || 1,
        page_size: data[0]?.limit || limit,
      };
    }
  }

  // THống kê Phê duyệt hồ sơ
  async fetchAtHtttCat(
    main_type: string,
    sub_type: string,
    loploi: string,
    lopbien: string,
    is_click_trong_ngay: boolean = false,
    from: string = '',
    to: string = '',
  ) {
    const { data, error } = await this.supabase
      .schema('btth')
      .rpc('at_httt_cat', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : '728',
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _from: !is_click_trong_ngay
          ? null
          : from
          ? this.formatDateCustom(from)
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: !is_click_trong_ngay
          ? null
          : to
          ? this.formatDateCustom(to)
          : this.endOfDayFormatted(new Date()),
      });
    if (error) {
      return null;
    } else {
      return data;
    }
  }

  // phan trang ho so fe duyet
  async fetchHtttList(
    main_type: string,
    sub_type: string,
    loploi: string,
    lopbien: string,
    capdo: any = null,
    is_click_trong_ngay: boolean = false,
    searchText: string = '',
    trang_thai: string = '',
    from: string = '',
    to: string = '',
    page: number = 1,
    limit: number = 5,
  ) {
    const { data, error } = await this.supabase
      .schema('btth')
      .rpc('at_httt_list', {
        _main_type: main_type ? main_type : null,
        _sub_type: sub_type ? sub_type : '728',
        _loploi: loploi ? loploi : null,
        _lopbien: lopbien ? lopbien : null,
        _capdo: capdo ? capdo : null,
        _trang_thai: trang_thai ? trang_thai : null,
        _search_text: searchText ? searchText?.trim() : null,
        _from: !is_click_trong_ngay
          ? null
          : from
          ? this.formatDateCustom(from)
          : this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        _to: !is_click_trong_ngay
          ? null
          : to
          ? this.formatDateCustom(to)
          : this.endOfDayFormatted(new Date()),
        _limit: limit,
        _page: page,
      });
    if (error) {
      return null;
    } else {
      return {
        items: data[0]?.data || [],
        total: data[0]?.total || 0,
        page_index: data[0]?.page || 1,
        page_size: data[0]?.limit || limit,
      };
    }
  }

  async ptm_chi_tiet_khacfuc(
    id: string,
    sys: any,
    from: any = null,
    to: any = null,
    page_index: any = 1,
    page_size: any = 5,
  ) {
    console.log('debug 1111111', { id, sys, from, to, page_index, page_size });
    // const { formattedToday, formattedOneday } = getDefaultDate();
    var sp: any = this.supabase
      .schema('btth')
      .from('v_khacfuc_attt')
      .select('*', { count: 'exact' })
      .contains('security_event_id', [id])
      .eq('type', sys);
    sp = from
      ? sp.gte('date', this.formatDateCustom(from))
      : sp.gte(
          'date',
          this.eightHourOfDayFormatted(new Date().getTime() - 86400000),
        );
    sp = from
      ? sp.lte('date', this.formatDateCustom(to))
      : sp.lte('date', this.endOfDayFormatted(new Date()));

    sp = sp.order('date', { ascending: false, nullsFirst: false });
    sp = sp.range((page_index - 1) * page_size, page_index * page_size - 1);
    var res = await sp;
    if (res.error) console.error('err:', res.error);
    return res?.error
      ? []
      : {
          items: res?.data || [],
          total: res?.total || 0,
          page_index,
          page_size,
        };
  }

  async tctt_chi_tiet_chu_de(id: string, from: any, to: any) {
    // const { formattedToday, formattedOneday } = getDefaultDate();

    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_chu_de', {
      _id_topic: id,
      _from: formatDate(from, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      _to: formatDate(to, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tctt chi tiết - Done');
    return res?.error ? [] : res?.data;
  }

  async tctt_tin_tieu_cuc_theo_chu_de(id: string, from: any, to: any) {
    // const { formattedToday, formattedOneday } = getDefaultDate();

    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_tin_tieu_cuc_theo_chu_de', {
      _id_topic: id,
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tctt tin tiêu cực theo chủ đề - Done');
    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_chu_de_nhieu_ngay(id: string, from: any, to: any) {
    // const { formattedToday, formattedOneday } = getDefaultDate();

    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_chu_de_nhieu_ngay', {
      _id_topic: id,
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tctt chi tiết chủ đề nhiều ngày - Done');
    return res?.error ? [] : res?.data;
  }

  // new
  // async tctt_chi_tiet_chu_de_con(id: string, from: any, to: any) {
  //   // const { formattedToday, formattedOneday } = getDefaultDate();

  //   var sp: any = this.supabase.schema('public');
  //   var res = await sp.rpc('tctt_chi_tiet_chu_de_con', {
  //     _id_topic: id,
  //     _from: from,
  //     _to: to,
  //   });
  //   if (res.error) console.error('err:', res.error);
  //   else console.log('Tctt chi tiết chủ đề con - Done');
  //   return res?.error ? [] : res?.data;
  // }

  // async tctt_chi_tiet_diem_tin(id: string, from: any) {
  //   // const { formattedToday, formattedOneday } = getDefaultDate();

  //   var sp: any = this.supabase.schema('public');
  //   var res = await sp.rpc('tctt_chi_tiet_diem_tin', {
  //     _id_news: id,
  //     _date: from,
  //   });
  //   if (res.error) console.error('err:', res.error);
  //   else console.log('Tctt chi tiết điểm tin - Done');
  //   return res?.error ? [] : res?.data;
  // }

  // async tctt_chi_tiet_diem_tin_nhieu_ngay(id: string, from: any, to: any) {
  //   // const { formattedToday, formattedOneday } = getDefaultDate();

  //   var sp: any = this.supabase.schema('public');
  //   var res = await sp.rpc('tctt_chi_tiet_diem_tin_nhieu_ngay', {
  //     _id_news: id,
  //     _from: from,
  //     _to: to,
  //   });
  //   if (res.error) console.error('err:', res.error);
  //   else console.log('Tctt chi tiết điểm tin nhiều ngày - Done');
  //   return res?.error ? [] : res?.data;
  // }

  async tctt_chi_tiet_diem_tin(id: string, from: any) {
    // const { formattedToday, formattedOneday } = getDefaultDate();

    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_diem_tin', {
      _id_news: id,
      _date: from,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tctt chi tiết điểm tin - Done');
    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_diem_tin_nhieu_ngay(id: string, from: any, to: any) {
    // const { formattedToday, formattedOneday } = getDefaultDate();

    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_diem_tin_nhieu_ngay', {
      _id_news: id,
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tctt chi tiết điểm tin nhiều ngày - Done');
    return res?.error ? [] : res?.data;
  }

  async tctt_chi_tiet_chu_de_con(id: string, from: any, to: any) {
    // const { formattedToday, formattedOneday } = getDefaultDate();

    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_chu_de_con', {
      _id_topic: id,
      _from: from,
      _to: to,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tctt chi tiết chủ đề con - Done');
    return res?.error ? [] : res?.data;
  }

  async trang_thai_bot_ct86() {
    // const { formattedToday, formattedOneday } = getDefaultDate();

    try {
      const { data, error } = await this.supabase
        .schema('public')
        .rpc('tctt_trang_thai_bot_ct86');

      if (error) {
        console.error('Error fetching data:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }

  async tctt_trang_thai_server_ct86() {
    // const { formattedToday, formattedOneday } = getDefaultDate();

    try {
      const { data, error } = await this.supabase
        .schema('public')
        .rpc('tctt_trang_thai_server_ct86');

      if (error) {
        console.error('Error fetching data:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }

  async tctt_chi_tiet_anh_theo_chu_de(id: string, date: any) {
    // const { formattedToday, formattedOneday } = getDefaultDate();

    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_chi_tiet_anh_theo_chu_de', {
      _id_topic: id,
      _date: date,
    });
    if (res.error) console.error('err:', res.error);
    else console.log('Tctt ảnh - Done');
    return res?.error ? [] : res?.data;
  }

  async tctt_thong_ke_doi_tuong_ct86_theo_don_vi() {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_thong_ke_doi_tuong_ct86_theo_don_vi', {});
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  async tctt_doi_tuong_ct86_phat_sinh_theo_don_vi(code: string) {
    var sp: any = this.supabase.schema('public');
    var res = await sp.rpc('tctt_doi_tuong_ct86_phat_sinh_theo_don_vi', {
      _code: code,
    });
    if (res.error) console.error('err:', res.error);
    return res?.error ? [] : res?.data;
  }

  async getRangeTime() {
    // mac = '00-00-00-00-02-7E' // debug
    let resp = await this.supabase
      .schema('btth')
      .from('setiing')
      .select('*')
      .eq('id', 1);
    console.log('resp', resp);
    return resp.error ? {} : resp.data[0];
  }

  getSupabase() {
    return this.supabase;
  }
}
