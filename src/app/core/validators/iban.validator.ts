import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function normalizeIban(input: string): string {
  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function ibanChecksum(iban: string): boolean {
  // Move first four chars to the end
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  // Replace letters with numbers: A=10, B=11, ... Z=35
  let converted = '';
  for (let i = 0; i < rearranged.length; i++) {
    const ch = rearranged.charAt(i);
    if (/[A-Z]/.test(ch)) {
      converted += (ch.charCodeAt(0) - 55).toString();
    } else {
      converted += ch;
    }
  }

  // Compute mod 97 using chunking to avoid big integers
  let remainder = 0;
  const chunkSize = 9; // safe chunk length for JS numbers
  for (let offset = 0; offset < converted.length; offset += chunkSize) {
    const part = remainder.toString() + converted.substr(offset, chunkSize);
    remainder = parseInt(part, 10) % 97;
  }

  return remainder === 1;
}

/**
 * Iran-only IBAN (Sheba) validator.
 * Accepts values that normalize to a valid IR IBAN (country code IR, length 26,
 * and valid MOD-97 checksum).
 */
export function iranIbanValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value == null || value === '') return null;
    if (typeof value !== 'string') return { iban: true };

    const cleaned = normalizeIban(value);
    // IR IBAN total length is 26
    if (cleaned.length !== 26) return { iban: true };
    if (!cleaned.startsWith('IR')) return { iban: true };

    // Basic pattern check: IR + 2 digits + rest alnum
    if (!/^IR[0-9]{2}[A-Z0-9]+$/.test(cleaned)) return { iban: true };

    try {
      const ok = ibanChecksum(cleaned);
      return ok ? null : { iban: true };
    } catch (e) {
      return { iban: true };
    }
  };
}

export default iranIbanValidator;
