import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}
  handleError(error: any): Observable<never> {
    console.error('Error occurred: ', error);
    return throwError(error);
  }
}
