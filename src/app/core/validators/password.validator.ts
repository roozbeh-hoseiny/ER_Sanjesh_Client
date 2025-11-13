import { ValidatorFn } from '@angular/forms';

// Password must be minimum 8 characters, include at least one uppercase,
// one lowercase, one number and one special character
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// Validator factory named `password` as requested. Returns `null` for empty
// values so `Validators.required` can be used alongside it when needed.
export function password(): ValidatorFn {
  return (control) => {
    const value = control?.value;
    if (value === null || value === undefined || String(value).length === 0) return null;
    return PASSWORD_PATTERN.test(String(value)) ? null : { password: true };
  };
}
