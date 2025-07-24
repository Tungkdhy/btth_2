import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDataPayload } from '../../../../models/payload-channel';
import {
  InfoSecAlertData,
  InfraAlertData,
  MapSubType,
} from '../../../../models/btth.interface';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import {
  getIpFromAlert,
  getIpTenMienV1,
  getRegionName,
  getType,
  getTypeNetwork,
} from '../../../../utils/table-utils';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUnitNameByPath } from '../../../../../../store/unit-btth/unit-btth.selectors';
import { Constant } from '../../../../../../core/config/constant';

@Component({
  selector: 'app-alert-detail-card',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './alert-detail-card.component.html',
  styleUrls: ['./alert-detail-card.component.scss'],
})
export class AlertDetailCardComponent {
  @Input() eventDataPayload: EventDataPayload;
  protected readonly MapSubType = MapSubType;
  protected readonly getType = getType;
  protected readonly getTypeNetwork = getTypeNetwork;
  protected readonly getRegionName = getRegionName;
  protected readonly getIpTenMienV1 = getIpTenMienV1;

  @Input() infraAlertData: InfraAlertData;
  @Input() infoSecAlertData: InfoSecAlertData;
  protected readonly getIpFromAlert = getIpFromAlert;

  private store = inject(Store);

  extractUnitName(input: string | null | undefined): string | null {
    // Kiểm tra nếu đầu vào là falsy (null, undefined, hoặc chuỗi rỗng)
    if (!input) {
      return null; // Trả về thông báo lỗi hoặc chuỗi rỗng
    }

    // Tách chuỗi theo dấu gạch nối "-"
    const parts = input.split('-');

    // Kiểm tra nếu có ít nhất 2 phần sau khi tách
    if (parts.length < 2) {
      return null; // Trả về thông báo lỗi nếu chuỗi không đúng định dạng
    }

    // Trả về phần sau dấu "-"
    return parts[1].trim(); // trim() để loại bỏ khoảng trắng ở đầu và cuối chuỗi
  }

  getUnitNameByPath(path: string): Observable<string | null> {
    return this.store.select(selectUnitNameByPath(path));
  }
}
