import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  private alertData: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {}

  sendAlertData(data: any): void {
    this.alertData.next(data);
  }

  getAlertData(): Observable<any> {
    return this.alertData.asObservable();
  }
}
