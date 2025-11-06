import { ITeacherLesson } from './mappedData';

export interface ISchoolTeacherResponse {
  id: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  mobile: string;
  email: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  uniqueId: string;
  lessons: ITeacherLesson[];
}
