import { ITeacherMeResponse } from '@/modules/teachers/models';

export interface IAdminTeacherResponse extends ITeacherMeResponse {}

export interface IAttachLessonToTeacherRequest {
  id: string;
  schoolId: string;
  lessonId: number;
}
export interface IDetachLessonFromTeacherRequest extends IAttachLessonToTeacherRequest {}
