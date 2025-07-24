import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/core/config/constant';
@Injectable({providedIn: 'root'})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(catchError(err => {
      let error = err.error.message || err.error.statusText;
      if (err.status === 403 || err.status === 401) {
        // this.toastr.warning('Phiên đăng nhập hết hạn');
        // call logout
        // this.tokenService.logout();
        // document.location.reload();
      } else if (err.status === 0) {
        error = 'Internal Error Server';
      } else if (err.status === Constant.ERROR_STATUS.BAD_REQUEST) {
        return throwError(err);
      } else if (err.status === Constant.ERROR_STATUS.SERVER_ERROR) {
        return throwError(err);
      }
       else if (err.status == Constant.ERROR_STATUS.INPUT_ERROR) {
        return throwError(err);
      } else {
        error = err.error.message || err.error.statusText;
      }

      // if (err.status != 404) {
      //   if (error) {
      //     this.toastr.warning(error.error, 'Thất bại');
      //   }
      //   return throwError(err);
      // }
      if (error) {
        this.toastr.error(error);
      }
      return throwError(err);
    }));
  }
}
