import { ValidatorFn } from '@angular/forms';

export function postalCodeValidator(): ValidatorFn {
  return (control) => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }
    return control.value.length === 10 && /^[0-9]{10}$/.test(control.value)
      ? null
      : { postalCode: true };
  };
}
