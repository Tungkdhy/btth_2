import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NetworkDeviceService } from '../../modules/device/services/network-device.service';
import { ResultAPIModel } from '../models/api-response.model';

export function hasSerialNumber(
  service: NetworkDeviceService,
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) {
      return of(null);
    } else {
      return service.hasSerialNumber(control.value).pipe(
        map((res: ResultAPIModel) => {
          return res.data ? { serialNumberExists: true } : null;
        }),
      );
    }
  };
}
