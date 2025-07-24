import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations: { [key: string]: string } = {
    // Original keys
    MILITARY_REGION: 'Khu vực quân sự',
    BACKBONE_NODES: 'Trạm quân sự',
    QA_ROUTE: 'Tuyến QA',
    QB_ROUTE: 'Tuyến QB',
    QC_ROUTE: 'Tuyến QC',
    MILITARY_BRANCH_LINE: 'Tuyến nhánh quân sự',

    // Administration
    COMMUNE: 'Xã',
    DISTRICT: 'Huyện',
    PROVINCE: 'Tỉnh',
    NATION: 'Quốc gia',

    // Internet
    AAE_CABLE: 'Cáp AAE',
    AAG_CABLE: 'Cáp AAG',
    ADC_CABLE: 'Cáp ADC',
    APG_CABLE: 'Cáp APG',
    SJC2_CABLE: 'Cáp SJC2',
    SMW3_CABLE: 'Cáp SMW3',
    TGN_CABLE: 'Cáp TGN',
    AGGREGATION_ROUTES: 'Tuyến Internet',
    CABLE_LANDING_STATIONS: 'Trạm cáp quang biển',
    FIBER_CABLE_TO_CHINA: 'Cáp quang đến Trung Quốc',
    FIBER_CABLE_TO_CAMPUCHIA: 'Cáp quang đến Campuchia',
    FIBER_CABLE_TO_LAOS: 'Cáp quang đến Lào',
  };

  constructor() {}

  translate(key: string): string {
    return this.translations[key.toUpperCase()] || key;
  }
}
