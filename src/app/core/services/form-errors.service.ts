import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export interface ValidationMessage {
  key: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class FormErrorsService {
  // return list of human friendly messages for a control
  getErrors(control: AbstractControl | null | undefined, fieldLabel?: string): ValidationMessage[] {
    if (!control || !control.errors) return [];
    const errors = control.errors as Record<string, any>;
    const label = fieldLabel ?? 'این فیلد';
    const out: ValidationMessage[] = [];

    if (errors['required']) {
      out.push({ key: 'required', message: `${label} الزامی است.` });
    }
    if (errors['requiredTrue']) {
      out.push({ key: 'requiredTrue', message: `${label} باید تایید شود.` });
    }
    if (errors['minlength']) {
      const info = errors['minlength'];
      out.push({
        key: 'minlength',
        message: `${label} باید حداقل ${info.requiredLength} کاراکتر داشته باشد (فعلی ${info.actualLength}).`,
      });
    }
    if (errors['maxlength']) {
      const info = errors['maxlength'];
      out.push({
        key: 'maxlength',
        message: `${label} نباید بیشتر از ${info.requiredLength} کاراکتر باشد (فعلی ${info.actualLength}).`,
      });
    }
    if (errors['min']) {
      const info = errors['min'];
      out.push({
        key: 'min',
        message: `${label} باید حداقل ${info.min} باشد (فعلی ${info.actual}).`,
      });
    }
    if (errors['max']) {
      const info = errors['max'];
      out.push({
        key: 'max',
        message: `${label} باید حداکثر ${info.max} باشد (فعلی ${info.actual}).`,
      });
    }
    if (errors['email']) {
      out.push({ key: 'email', message: `${label} ایمیل معتبری نیست.` });
    }
    if (errors['pattern']) {
      out.push({ key: 'pattern', message: `${label} فرمت معتبری ندارد.` });
    }
    if (errors['mismatch']) {
      out.push({ key: 'mismatch', message: `${label} تکرار رمز با رمز وارد شده مطابقت ندارد.` });
    }
    if (errors['postalCode']) {
      out.push({ key: 'postalCode', message: `${label}  معتبر نیست.` });
    }
    if (errors['invalidMobile']) {
      out.push({ key: 'invalidMobile', message: `${label} معتبر نیست.` });
    }
    // fallback: include any other error keys
    Object.keys(errors).forEach((k) => {
      if (
        [
          'required',
          'requiredTrue',
          'minlength',
          'maxlength',
          'min',
          'max',
          'email',
          'pattern',
        ].indexOf(k) === -1
      ) {
        try {
          const val = errors[k];
          out.push({
            key: k,
            message: `${label}: ${typeof val === 'string' ? val : JSON.stringify(val)}`,
          });
        } catch {
          out.push({ key: k, message: `${label}: ${k}` });
        }
      }
    });

    return out;
  }
}
