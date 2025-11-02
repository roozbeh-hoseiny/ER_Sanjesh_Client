import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Reusable validator that sets a 'mismatch' error on the matching control when values differ.
export function MustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) return null;

    // If another validator has already found an error on the matching control, don't overwrite it.
    const existingErrors = matchingControl.errors ? { ...matchingControl.errors } : null;
    if (existingErrors && !existingErrors['mismatch']) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ ...(existingErrors ?? {}), mismatch: true });
    } else {
      if (existingErrors) {
        delete existingErrors['mismatch'];
        const remaining = Object.keys(existingErrors).length ? existingErrors : null;
        matchingControl.setErrors(remaining as any);
      } else {
        matchingControl.setErrors(null);
      }
    }

    return null;
  };
}
