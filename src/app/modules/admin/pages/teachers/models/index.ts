import { IAdminTeacherResponse } from './io';

export * from './io.d';
export * from './mappedData.d';

export interface IAdminTeacherEntity extends Omit<IAdminTeacherResponse, 'gender'> {
  fullname: string;
  gender: 'زن' | 'مرد';
}
