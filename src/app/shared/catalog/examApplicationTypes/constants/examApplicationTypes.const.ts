export enum ExamApplicationTypes {
  ON_SITE,
  ONLINE,
  BOTH,
}

export type TExamApplicationTypeKey = keyof typeof ExamApplicationTypes;

export interface IExamApplicationType {
  id: number;
  title: string;
  value: ExamApplicationTypes;
  severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
  icon: string;
}

export const ExamApplicationTypeList: IExamApplicationType[] = [
  {
    id: 1,
    title: 'حضوری',
    value: ExamApplicationTypes.ON_SITE,
    severity: 'success',
    icon: 'pi pi-fw pi-home',
  },
  {
    id: 2,
    title: 'آنلاین',
    value: ExamApplicationTypes.ONLINE,
    severity: 'info',
    icon: 'pi pi-fw pi-globe',
  },
  {
    id: 3,
    title: 'هردو',
    value: ExamApplicationTypes.BOTH,
    severity: 'secondary',
    icon: 'pi pi-fw pi-share-alt',
  },
];

export const findExamApplicationTypeById = (id: number) => {
  return ExamApplicationTypeList.find((type) => type.id === id) || null;
};
