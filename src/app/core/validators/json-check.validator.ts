import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function JsonCheckValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let value = control.value;
    value = typeof value !== 'string' ? JSON.stringify(value) : value;
    if (!value) {
      return null;
    }

    try {
      value = JSON.parse(value);
    } catch (e) {
      return {JSONFormat: true};
    }

    return !(typeof value === 'object') ? {JSONFormat: true} : null;
  };
}
