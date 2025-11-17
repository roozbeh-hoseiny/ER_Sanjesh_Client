import {
  IAttachLessonToTeacherRequest,
  IDetachLessonFromTeacherRequest,
} from '@/modules/admin/pages/teachers/models';
import {
  IApproveSchoolLessonRequestPayload,
  IApproveSchoolRequestPayload,
  IDetachSchoolRequestPayload,
  IRejectSchoolLessonRequestPayload,
  IRejectSchoolRequestPayload,
} from '@/modules/teachers/models';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface SchoolTeacherListService {
  attachLesson(payload: IAttachLessonToTeacherRequest): Observable<boolean>;
  detachLesson(payload: IDetachLessonFromTeacherRequest): Observable<boolean>;

  // attachSchool(payload: IAttachFieldToSchoolRequestPayload): Observable<boolean>;
  detachTeacher(payload: IDetachSchoolRequestPayload): Observable<boolean>;

  approveTeacher(payload: IApproveSchoolRequestPayload): Observable<boolean>;
  rejectTeacher(payload: IRejectSchoolRequestPayload): Observable<boolean>;

  approveTeacherLesson(payload: IApproveSchoolLessonRequestPayload): Observable<boolean>;
  rejectTeacherLesson(payload: IRejectSchoolLessonRequestPayload): Observable<boolean>;
}

export const SCHOOL_TEACHER_LIST_SERVICE = new InjectionToken<SchoolTeacherListService>(
  'SCHOOL_TEACHER_LIST_SERVICE',
);
