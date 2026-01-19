export function toArabicDigitsAwareNumber(str: string): string {
  if (!str) return '';
  const map: Record<string, string> = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  };
  return str.replace(/[٠-٩۰-۹]/g, (d) => map[d] ?? d);
}

export function cleanNumericString(raw: string): string {
  const ascii = toArabicDigitsAwareNumber(raw || '');
  return ascii.replace(/[^0-9.\-]/g, '');
}

export function normalizeToNumber(raw: number | string | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return isFinite(raw) ? raw : null;
  const cleaned = cleanNumericString(String(raw));
  if (cleaned === '') return null;
  const num = Number(cleaned);
  return isNaN(num) ? null : num;
}

export function formatNumber(
  value: number,
  opts?: { locale?: string; useComma?: boolean; fraction?: number },
): string {
  try {
    const fmtLocale = opts?.useComma ? 'en-US' : (opts?.locale ?? 'fa-IR');
    return new Intl.NumberFormat(fmtLocale, {
      maximumFractionDigits: opts?.fraction ?? 0,
      minimumFractionDigits: 0,
      useGrouping: true,
    }).format(value);
  } catch (e) {
    return String(value);
  }
}

export function formatWithCurrency(
  num: number | string | null,
  isInputHost: boolean = false,
  currency: string | null | undefined = 'ریال',
  opts?: { locale?: string; useComma?: boolean; fraction?: number },
): string {
  if (num === null) return '';
  const formatted = formatNumber(parseFloat(num + ''), opts);
  if (isInputHost) return formatted;
  if (currency && currency.trim()) return `${formatted} ${currency.trim()}`;
  return formatted;
}

export default {
  toArabicDigitsAwareNumber,
  cleanNumericString,
  normalizeToNumber,
  formatNumber,
  formatWithCurrency,
};
