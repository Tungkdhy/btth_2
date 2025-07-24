import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function Ipv4AddressValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const MACValid = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/.test(value);
    return !MACValid ? {Ipv4AddressValid: true} : null;
  };
}
