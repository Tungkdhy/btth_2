import { HttpClient, HttpEvent } from '@angular/common/http';
import { Constant } from '../config/constant';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import {CONFIG} from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ApiHelper {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  private getUrlEndpoint(url: string) {
    // return this.config.getBackendApi() + url;
    return CONFIG.API.BACKEND.URL + url;
  }

  get(url: string, options?: any): Observable<any> {
    url = this.getUrlEndpoint(url);
    return this.http.get(url, options);
  }

  post(url: string, body: any, options?: any): Observable<any> {
    url = this.getUrlEndpoint(url);
    return this.http.post(url, body, options);
  }

  put(url: string, body: any, options?: any): Observable<any> {
    url = this.getUrlEndpoint(url);
    return this.http.put(url, body, options);
  }

  delete(
    url: string,
    options?: { body?: any; headers?: any },
  ): Observable<any> {
    url = this.getUrlEndpoint(url);
    return this.http.delete(url, options);
  }

  request(request: any): Observable<HttpEvent<any>> {
    return this.http.request(request);
  }
}
