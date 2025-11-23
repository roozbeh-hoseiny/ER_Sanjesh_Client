import { Maybe } from '@/core';
import {
  IAttachLessonToTeacherRequest,
  IDetachLessonFromTeacherRequest,
} from '@/modules/admin/pages/teachers/models';
import {
  IApproveAllLessonsRequestPayload,
  IApproveSchoolLessonRequestPayload,
  IDetachSchoolRequestPayload,
  IRejectAllLessonsRequestPayload,
  IRejectSchoolLessonRequestPayload,
} from '@/modules/teachers/models';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ISchoolTeacherMappedData } from '../../../models';

export interface SchoolTeacherListService {
  attachLesson(payload: IAttachLessonToTeacherRequest): Observable<boolean>;
  detachLesson(payload: IDetachLessonFromTeacherRequest): Observable<boolean>;

  // attachSchool(payload: IAttachFieldToSchoolRequestPayload): Observable<boolean>;
  detachTeacher(payload: IDetachSchoolRequestPayload): Observable<boolean>;

  approveTeacher(payload: IApproveAllLessonsRequestPayload): Observable<boolean>;
  rejectTeacher(payload: IRejectAllLessonsRequestPayload): Observable<boolean>;

  approveTeacherLesson(payload: IApproveSchoolLessonRequestPayload): Observable<boolean>;
  rejectTeacherLesson(payload: IRejectSchoolLessonRequestPayload): Observable<boolean>;

  getTeacher(uniqueId: string): Observable<Maybe<ISchoolTeacherMappedData>>;
}

export const SCHOOL_TEACHER_LIST_SERVICE = new InjectionToken<SchoolTeacherListService>(
  'SCHOOL_TEACHER_LIST_SERVICE',
);
