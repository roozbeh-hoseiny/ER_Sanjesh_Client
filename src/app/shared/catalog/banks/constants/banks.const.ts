export enum BANKS {
  AYANDEH,
  IRANZAMIN,
  EGHTESADNOVIN,
  ANSAR,
  PASARGAD,
  PARSIAN,
  POSTBANK,
  TEJARAT,
  TOSSEETAVON,
  TOSSEESADERAT,
  HEKMATIRANIAN,
  REFAHKARGARAN,
  GHARZALHESANEHRESALAT,
  GHARZALHESANEMEHIRIRAN,
  GHAVAMIN,
  KESHAVARZI,
  KOSAR,
  DEY,
  SANATVEMAADAN,
  SINA,
  SARMAYEH,
  SEPAH,
  SHAHR,
  SADERATIRAN,
  SAMAN,
  MARKAZI,
  MASKAN,
  MELAT,
  MELIIRAN,
  MEHREQTESAD,
  KARAFARIN,
  TAT,
}

export type TBanks = keyof typeof BANKS;

export interface IBank {
  id: number;
  title: string;
  value: BANKS;
}

export const BankList: IBank[] = [
  {
    id: 2,
    title: 'ایران زمین',
    value: BANKS.IRANZAMIN,
  },
  {
    id: 3,
    title: 'اقتصاد نوین',
    value: BANKS.EGHTESADNOVIN,
  },

  {
    id: 5,
    title: 'پاسارگاد',
    value: BANKS.PASARGAD,
  },
  {
    id: 6,
    title: 'پارسیان',
    value: BANKS.PARSIAN,
  },
  {
    id: 7,
    title: 'پست‌ بانک ایران',
    value: BANKS.POSTBANK,
  },
  {
    id: 8,
    title: 'تجارت',
    value: BANKS.TEJARAT,
  },
  {
    id: 9,
    title: 'توسعه تعاون',
    value: BANKS.TOSSEETAVON,
  },
  {
    id: 10,
    title: 'توسعه صادرات',
    value: BANKS.TOSSEESADERAT,
  },
  {
    id: 12,
    title: 'رفاه کارگران',
    value: BANKS.REFAHKARGARAN,
  },
  {
    id: 13,
    title: 'قرض‌الحسنه رسالت',
    value: BANKS.GHARZALHESANEHRESALAT,
  },
  {
    id: 14,
    title: 'قرض‌الحسنه مهر ایران',
    value: BANKS.GHARZALHESANEMEHIRIRAN,
  },
  {
    id: 16,
    title: 'کشاورزی',
    value: BANKS.KESHAVARZI,
  },
  {
    id: 18,
    title: 'دی',
    value: BANKS.DEY,
  },
  {
    id: 19,
    title: 'صنعت و معدن',
    value: BANKS.SANATVEMAADAN,
  },
  {
    id: 20,
    title: 'سینا',
    value: BANKS.SINA,
  },
  {
    id: 21,
    title: 'سرمایه',
    value: BANKS.SARMAYEH,
  },
  {
    id: 22,
    title: 'سپه',
    value: BANKS.SEPAH,
  },
  {
    id: 23,
    title: 'شهر',
    value: BANKS.SHAHR,
  },
  {
    id: 24,
    title: 'صادرات ایران',
    value: BANKS.SADERATIRAN,
  },
  {
    id: 25,
    title: 'سامان',
    value: BANKS.SAMAN,
  },
  {
    id: 27,
    title: 'مسکن',
    value: BANKS.MASKAN,
  },
  {
    id: 28,
    title: 'ملت',
    value: BANKS.MELAT,
  },
  {
    id: 29,
    title: 'ملی ایران',
    value: BANKS.MELIIRAN,
  },
  {
    id: 30,
    title: 'مهر اقتصاد',
    value: BANKS.MEHREQTESAD,
  },
  {
    id: 31,
    title: 'کارآفرین',
    value: BANKS.KARAFARIN,
  },
];

export const findBankById = (id: number) => {
  return BankList.find((type) => type.id === id) || null;
};
