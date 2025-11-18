import { ISchoolTeacherRawResponse } from './io';

export interface ITeacherLesson {
  lessonId: number;
  schoolId: string;
  lessonTitle: string;
  schoolTitle: string;
  educationaLevellId: number;
  educationalLevelTitle: string;
  fieldOfStudyId: number;
  fieldOfStudyTitle: string;
}

export interface ISchoolTeacherMappedData extends ISchoolTeacherRawResponse {
  fullname: string;
}
