import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator for mobile phone numbers.
 *
 * Behavior/assumptions:
 * - Allows common Iranian mobile formats:
 *   - 09xxxxxxxxx (leading 0, total 11 digits)
 *   - +989xxxxxxxxx (international +98 followed by 9 and 9 digits)
 *   - 9xxxxxxxxx (no leading 0, 10 digits)
 * - Treats empty / null / undefined values as valid (use Validators.required when needed).
 * - Returns `{ invalidMobile: true }` when the value does not match the pattern.
 */
export function mobileValidator(): ValidatorFn {
  const re = /^(?:(?:\+98)|0)?9\d{9}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v === null || v === undefined || v === '') {
      return null; // leave required validation to Validators.required
    }

    if (typeof v !== 'string') {
      return { invalidMobile: true };
    }

    const trimmed = v.trim();
    return re.test(trimmed) ? null : { invalidMobile: true };
  };
}
