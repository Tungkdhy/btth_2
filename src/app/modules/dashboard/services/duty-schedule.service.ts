import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DutySchedule, UnitDutyDetail } from '../models/btth.interface';
import { map } from 'rxjs/operators';
import { CONFIG } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DutyScheduleService {
  private readonly apiUrl = `${CONFIG.API.BACKEND.DUTY_SCHEDULE}`;
  constructor(private http: HttpClient) {}

  getDutySchedule(): Observable<DutySchedule> {
    return this.http.get<any>(`${this.apiUrl}/QuanSo_LichTruc`).pipe(
      map((response) => ({
        present: response.CoMat,
        dutySchedules: response.LichTruc.map((unit: any) => ({
          unitId: unit.Id_DonVi,
          unitName: unit.TenDonVi,
          deputyDutyOfficer: unit.TrucBanPho,
          dutyOfficer: unit.TrucBanTruong,
          commandingOfficer: unit.TrucCH,
        })),
        reportDate: response.NgayBaoCao,
        personnelCount: response.QuanSo,
        dutyCommander: response.TrucChiHuy,
        absent: response.Vang,
      })),
    );
  }

  getUnitDutyId(unitId: string): Observable<UnitDutyDetail> {
    return this.http.get<any>(`${this.apiUrl}?iddonvi=${unitId}`).pipe(
      map((response) => ({
        unitId: response.Id_DonVi,
        fullUnitName: response.TenDayDu,
        unitName: response.TenDonVi,
        deputyDutyOfficer: response.TrucBanPho,
        dutyOfficer: response.TrucBanTruong,
        commandingOfficer: response.TrucCH,
        abbreviation: response.Viettat,
      })),
    );
  }
}
