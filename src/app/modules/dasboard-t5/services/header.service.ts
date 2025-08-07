// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiHeaderService {
  private baseUrl = 'http://10.10.53.58:8002/rest/v1/rpc';

  private headers = new HttpHeaders({
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  fetchData(body: any): Observable<any> {
    const url = `${this.baseUrl}/headers_dhtc`;
    return this.http.post(url, body, { headers: this.headers });
  }
  fetchDataTruc(body: any): Observable<any> {
    const url = `${this.baseUrl}/headers_kip_truc_sscd`;
    return this.http.post(url, body, { headers: this.headers });
  }
}
