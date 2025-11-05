import { IAdminTeacherResponse } from './io';

export * from './io';

export interface IAdminTeacherEntity extends Omit<IAdminTeacherResponse, 'gender'> {
  fullname: string;
  gender: 'زن' | 'مرد';
}
