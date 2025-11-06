import { ITeacherLesson } from './mappedData';

export interface IAdminTeacherResponse {
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

export interface IAttachLessonToTeacherRequest {
  id: string;
  schoolId: string;
  lessonId: string;
}
export interface IDetachLessonFromTeacherRequest extends IAttachLessonToTeacherRequest {}
