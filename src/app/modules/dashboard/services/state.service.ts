import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IData {
  id: string;
  type?: string;
  cyber_code?: string;
}
@Injectable({
  providedIn: 'root',
})
export class StateService {
  private viewDetail = new BehaviorSubject<IData | null>(null);
  private activeRow = new BehaviorSubject<string | null>(null);
  private activeChildRow = new BehaviorSubject<string | null>(null);
  private detailTarget = new BehaviorSubject<any | null>(null);
  viewDetail$ = this.viewDetail.asObservable();
  activeRow$ = this.activeRow.asObservable();
  activeChildRow$ = this.activeRow.asObservable();
  detailTarget$ = this.detailTarget.asObservable();

  onShowDetailTarget(data: any | null) {
    this.detailTarget.next(data);
  }
  onSelect(data: IData | null) {
    this.viewDetail.next(data);
  }
  onRowSelected(key: string | null) {
    this.activeRow.next(key);
  }
  onChildRowSelected(key: string | null) {
    this.activeChildRow.next(key);
  }
}
