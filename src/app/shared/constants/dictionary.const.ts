export const DICTIONARY = {
  gender: 'جنسیت',
  age: 'سن',
  address: 'آدرس',
} as { [key: string]: string };

export type TDictionary = keyof typeof DICTIONARY;
