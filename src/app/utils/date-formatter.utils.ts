import jalaliPlugin from '@zoomit/dayjs-jalali-plugin';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fa';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with plugins
dayjs.extend(jalaliPlugin);
dayjs.extend(relativeTime);

/**
 * Common date format patterns for Jalali calendar
 */
export const JALALI_DATE_FORMATS = {
  /** Full date with weekday: "پنج‌شنبه، ۱۳ شهریور ۱۳۹۷" */
  FULL_WITH_WEEKDAY: 'dddd، DD MMMM YYYY',
  /** Full date: "۱۳ شهریور ۱۳۹۷" */
  FULL: 'DD MMMM YYYY',
  /** Short date with month name: "۱۳ شهریور ۹۷" */
  SHORT: 'DD MMMM YY',
  /** Numeric date: "۱۳۹۷/۰۶/۱۳" */
  NUMERIC: 'YYYY/MM/DD',
  /** Numeric date with time: "۱۳۹۷/۰۶/۱۳ ۱۶:۳۰" */
  NUMERIC_WITH_TIME: 'YYYY/MM/DD HH:mm',
  /** Numeric date with full time: "۱۳۹۷/۰۶/۱۳ ۱۶:۳۰:۱۵" */
  NUMERIC_WITH_FULL_TIME: 'YYYY/MM/DD HH:mm:ss',
  /** Time only: "۱۶:۳۰" */
  TIME: 'HH:mm',
  /** Time with seconds: "۱۶:۳۰:۱۵" */
  TIME_WITH_SECONDS: 'HH:mm:ss',
  /** Month and year: "شهریور ۱۳۹۷" */
  MONTH_YEAR: 'MMMM YYYY',
  /** Day and month: "۱۳ شهریور" */
  DAY_MONTH: 'DD MMMM',
} as const;

/**
 * Common date format patterns for Gregorian calendar
 */
export const GREGORIAN_DATE_FORMATS = {
  /** Full date with weekday: "Thursday, September 04 2018" */
  FULL_WITH_WEEKDAY: 'dddd, MMMM DD YYYY',
  /** Full date: "September 04 2018" */
  FULL: 'MMMM DD YYYY',
  /** Short date: "Sep 04 18" */
  SHORT: 'MMM DD YY',
  /** Numeric date: "2018-09-04" */
  NUMERIC: 'YYYY-MM-DD',
  /** Numeric date with time: "2018-09-04 16:30" */
  NUMERIC_WITH_TIME: 'YYYY-MM-DD HH:mm',
  /** Numeric date with full time: "2018-09-04 16:30:15" */
  NUMERIC_WITH_FULL_TIME: 'YYYY-MM-DD HH:mm:ss',
  /** Time only: "16:30" */
  TIME: 'HH:mm',
  /** Time with seconds: "16:30:15" */
  TIME_WITH_SECONDS: 'HH:mm:ss',
  /** Month and year: "September 2018" */
  MONTH_YEAR: 'MMMM YYYY',
  /** Day and month: "September 04" */
  DAY_MONTH: 'MMMM DD',
} as const;

/**
 * Format a date as Jalali (Persian) calendar in Farsi locale
 *
 * @param date - Date to format (string, Date, Dayjs, or timestamp)
 * @param format - Format pattern (default: 'YYYY/MM/DD')
 * @returns Formatted date string in Jalali calendar
 *
 * @example
 * formatJalali('2018-09-04') // '1397/06/13'
 * formatJalali('2018-09-04', JALALI_DATE_FORMATS.FULL) // '۱۳ شهریور ۱۳۹۷'
 * formatJalali(new Date(), JALALI_DATE_FORMATS.FULL_WITH_WEEKDAY) // 'پنج‌شنبه، ۱۳ شهریور ۱۳۹۷'
 */
export function formatJalali(
  date: string | Date | Dayjs | number,
  format: string = JALALI_DATE_FORMATS.NUMERIC,
): string {
  return dayjs(date).calendar('jalali').locale('fa').format(format);
}

/**
 * Format a date as Gregorian calendar in English locale
 *
 * @param date - Date to format (string, Date, Dayjs, or timestamp)
 * @param format - Format pattern (default: 'YYYY-MM-DD')
 * @returns Formatted date string in Gregorian calendar
 *
 * @example
 * formatGregorian('1397/06/13', GREGORIAN_DATE_FORMATS.FULL) // 'September 04 2018'
 * formatGregorian(new Date(), GREGORIAN_DATE_FORMATS.NUMERIC_WITH_TIME) // '2018-09-04 16:30'
 */
export function formatGregorian(
  date: string | Date | Dayjs | number,
  format: string = GREGORIAN_DATE_FORMATS.NUMERIC,
): string {
  return dayjs(date).calendar('gregory').locale('en').format(format);
}

/**
 * Parse a Jalali date string and return a Dayjs instance
 *
 * @param jalaliDate - Jalali date string (e.g., '1398-10-17')
 * @param format - Optional format pattern for parsing
 * @returns Dayjs instance
 *
 * @example
 * parseJalali('1398-10-17') // Dayjs instance
 * parseJalali('1398/10/17') // Dayjs instance
 */
export function parseJalali(jalaliDate: string, format?: string): Dayjs {
  return dayjs(jalaliDate, { jalali: true, ...(format && { format }) });
}

/**
 * Convert a Gregorian date to Jalali format
 *
 * @param gregorianDate - Gregorian date string, Date object, or Dayjs instance
 * @param format - Optional format pattern (default: 'YYYY/MM/DD')
 * @returns Formatted Jalali date string
 *
 * @example
 * gregorianToJalali('2018-09-04') // '1397/06/13'
 * gregorianToJalali('2018-09-04', JALALI_DATE_FORMATS.FULL) // '۱۳ شهریور ۱۳۹۷'
 */
export function gregorianToJalali(
  gregorianDate: string | Date | Dayjs,
  format: string = JALALI_DATE_FORMATS.NUMERIC,
): string {
  return dayjs(gregorianDate).calendar('jalali').locale('fa').format(format);
}

/**
 * Convert a Jalali date to Gregorian format
 *
 * @param jalaliDate - Jalali date string (e.g., '1398-10-17')
 * @param format - Optional format pattern (default: 'YYYY-MM-DD')
 * @returns Formatted Gregorian date string
 *
 * @example
 * jalaliToGregorian('1398-10-17') // '2020-01-07'
 * jalaliToGregorian('1397/06/13', GREGORIAN_DATE_FORMATS.FULL) // 'September 04 2018'
 */
export function jalaliToGregorian(
  jalaliDate: string,
  format: string = GREGORIAN_DATE_FORMATS.NUMERIC,
): string {
  return parseJalali(jalaliDate).calendar('gregory').locale('en').format(format);
}

/**
 * Get current date and time in Jalali format
 *
 * @param format - Optional format pattern (default: 'YYYY/MM/DD HH:mm')
 * @returns Current date and time in Jalali format
 *
 * @example
 * nowJalali() // '1403/12/05 14:30'
 * nowJalali(JALALI_DATE_FORMATS.FULL_WITH_WEEKDAY) // 'یکشنبه، ۵ اسفند ۱۴۰۳'
 */
export function nowJalali(format: string = JALALI_DATE_FORMATS.NUMERIC_WITH_TIME): string {
  return dayjs().calendar('jalali').locale('fa').format(format);
}

/**
 * Get current date and time in Gregorian format
 *
 * @param format - Optional format pattern (default: 'YYYY-MM-DD HH:mm')
 * @returns Current date and time in Gregorian format
 *
 * @example
 * nowGregorian() // '2026-02-24 14:30'
 * nowGregorian(GREGORIAN_DATE_FORMATS.FULL_WITH_WEEKDAY) // 'Sunday, February 24 2026'
 */
export function nowGregorian(format: string = GREGORIAN_DATE_FORMATS.NUMERIC_WITH_TIME): string {
  return dayjs().calendar('gregory').locale('en').format(format);
}

/**
 * Format a time duration as a relative time string in Farsi
 *
 * @param date - Date to compare against current time
 * @returns Relative time string in Farsi
 *
 * @example
 * relativeTimeJalali(dayjs().subtract(2, 'day')) // '۲ روز پیش'
 */
export function relativeTimeJalali(date: string | Date | Dayjs | number): string {
  return dayjs(date).locale('fa').fromNow();
}

/**
 * Check if a date string is a valid Jalali date
 *
 * @param jalaliDate - Jalali date string
 * @returns true if valid, false otherwise
 *
 * @example
 * isValidJalaliDate('1398-10-17') // true
 * isValidJalaliDate('1398-13-17') // false
 */
export function isValidJalaliDate(jalaliDate: string): boolean {
  return parseJalali(jalaliDate).isValid();
}

/**
 * Get the start of day for a date in Jalali calendar
 *
 * @param date - Date to get start of day for
 * @returns Dayjs instance at start of day
 *
 * @example
 * startOfDayJalali('1398-10-17') // Dayjs instance at 00:00:00
 */
export function startOfDayJalali(date: string | Date | Dayjs | number): Dayjs {
  return dayjs(date).calendar('jalali').startOf('day');
}

/**
 * Get the end of day for a date in Jalali calendar
 *
 * @param date - Date to get end of day for
 * @returns Dayjs instance at end of day
 *
 * @example
 * endOfDayJalali('1398-10-17') // Dayjs instance at 23:59:59
 */
export function endOfDayJalali(date: string | Date | Dayjs | number): Dayjs {
  return dayjs(date).calendar('jalali').endOf('day');
}

/**
 * Format a date with custom calendar and locale
 *
 * @param date - Date to format
 * @param calendar - Calendar type ('jalali' | 'gregory')
 * @param locale - Locale ('fa' | 'en')
 * @param format - Format pattern
 * @returns Formatted date string
 *
 * @example
 * formatDate('2018-09-04', 'jalali', 'fa', 'DD MMMM YYYY') // '۱۳ شهریور ۱۳۹۷'
 * formatDate('2018-09-04', 'gregory', 'en', 'MMMM DD YYYY') // 'September 04 2018'
 */
export function formatDate(
  date: string | Date | Dayjs | number,
  calendar: 'jalali' | 'gregory',
  locale: 'fa' | 'en',
  format: string,
): string {
  return dayjs(date).calendar(calendar).locale(locale).format(format);
}

/**
 * Get Jalali month name in Farsi
 *
 * @param monthNumber - Month number (1-12)
 * @returns Month name in Farsi
 *
 * @example
 * getJalaliMonthName(1) // 'فروردین'
 * getJalaliMonthName(6) // 'شهریور'
 */
export function getJalaliMonthName(monthNumber: number): string {
  const monthNames = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];
  return monthNames[monthNumber - 1] || '';
}

/**
 * Get Jalali weekday name in Farsi
 *
 * @param dayNumber - Day number (0-6, where 0 is Saturday)
 * @returns Weekday name in Farsi
 *
 * @example
 * getJalaliWeekdayName(0) // 'شنبه'
 * getJalaliWeekdayName(4) // 'چهارشنبه'
 */
export function getJalaliWeekdayName(dayNumber: number): string {
  const weekdayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
  return weekdayNames[dayNumber] || '';
}

export default {
  formatJalali,
  formatGregorian,
  parseJalali,
  gregorianToJalali,
  jalaliToGregorian,
  nowJalali,
  nowGregorian,
  relativeTimeJalali,
  isValidJalaliDate,
  startOfDayJalali,
  endOfDayJalali,
  formatDate,
  getJalaliMonthName,
  getJalaliWeekdayName,
  JALALI_DATE_FORMATS,
  GREGORIAN_DATE_FORMATS,
};
