import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComputerService } from '../../modules/endpoint/services/computer.service';
import { ResultAPIModel } from '../models/api-response.model';

export function MacAddressValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const MACValid =
      /^[0-9a-f]{2}([-])(?:[0-9a-f]{2}\1){4}[0-9a-f]{2}$/gim.test(value);
    // const MACValid = /^[0-9a-f]{1,2}([\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/gmi.test(value);
    return !MACValid ? { MACAddressValid: true } : null;
  };
}

export function hasMACValidator(service: ComputerService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) {
      return of(null);
    } else {
      return service.hasMAC(control.value).pipe(
        map((res: ResultAPIModel) => {
          return res.data ? { MacExists: true } : null;
        }),
      );
    }
  };
}
