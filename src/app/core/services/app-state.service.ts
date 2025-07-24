import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Biến trạng thái: true = hiển thị bản đồ, false = ẩn bản đồ
  private _showMap = new BehaviorSubject<boolean>(false);

  // Observable để component khác có thể theo dõi
  showMap$ = this._showMap.asObservable();

  // Hàm để cập nhật trạng thái
  setShowMap(value: boolean) {
    this._showMap.next(value);
  }

  // Hàm tiện lợi để toggle
  toggleShowMap() {
    this._showMap.next(!this._showMap.value);
  }
}