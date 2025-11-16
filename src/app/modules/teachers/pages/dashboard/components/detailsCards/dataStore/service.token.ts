import { Maybe } from '@/core';
import { IAdminSchoolRawResponse } from '@/modules/admin/pages/schools/models/schools';
import {
  IAttachLessonToTeacherRequest,
  IDetachLessonFromTeacherRequest,
} from '@/modules/admin/pages/teachers/models';
import {
  IApproveSchoolLessonRequestPayload,
  IApproveSchoolRequestPayload,
  IAttachLessonRequestPayload,
  IDetachLessonRequestPayload,
  IDetachSchoolRequestPayload,
  IRejectSchoolLessonRequestPayload,
  IRejectSchoolRequestPayload,
} from '@/modules/teachers/models';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface TeacherDetailsService {
  editLoginInfo(request: any): Observable<any>;

  validateEmail(id: string): Observable<boolean> | void;
  validateMobile(id: string): Observable<boolean> | void;
  invalidateEmail(id: string): Observable<boolean>;
  invalidateMobile(id: string): Observable<boolean>;

  attachLesson(payload: IAttachLessonToTeacherRequest): Observable<boolean>;
  detachLesson(payload: IDetachLessonFromTeacherRequest): Observable<boolean>;

  // attachSchool(payload: IAttachFieldToSchoolRequestPayload): Observable<boolean>;
  detachSchool(payload: IDetachSchoolRequestPayload): Observable<boolean>;

  approveSchool(payload: IApproveSchoolRequestPayload): Observable<boolean>;
  rejectSchool(payload: IRejectSchoolRequestPayload): Observable<boolean>;

  approveSchoolLesson(payload: IApproveSchoolLessonRequestPayload): Observable<boolean>;
  rejectSchoolLesson(payload: IRejectSchoolLessonRequestPayload): Observable<boolean>;

  attachLesson(payload: IAttachLessonRequestPayload): Observable<boolean>;
  detachLesson(payload: IDetachLessonRequestPayload): Observable<boolean>;

  getSchool(schoolId: string): Observable<Maybe<IAdminSchoolRawResponse>>;
}

export const TEACHER_DETAILS_SERVICE = new InjectionToken<TeacherDetailsService>(
  'TEACHER_DETAILS_SERVICE',
);
