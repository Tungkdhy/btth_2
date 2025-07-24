import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../../modules/dashboard/services/supabase.service';
import { from, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestInterceptor implements HttpInterceptor {
  // constructor(private authService: SupabaseService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let headerConfig = {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    };
    // if (tokenValue != undefined) {
    //   if (!request.headers.has('Authorization')) {
    //     // @ts-ignore
    //     headerConfig['Authorization'] = `Bearer ${tokenValue}`;
    //   }
    // }
    if (request.headers.has('mode')) {
      let headerConfig = {
        'Access-Control-Allow-Origin': '*',
      };
      request = request.clone({
        setHeaders: headerConfig,
      });
      return next.handle(request);
    }

    request = request.clone({
      setHeaders: headerConfig,
    });
    return next.handle(request);
  }
}
