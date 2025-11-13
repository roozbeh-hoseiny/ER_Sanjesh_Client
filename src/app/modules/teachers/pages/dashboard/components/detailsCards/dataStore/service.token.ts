import {
  IApproveSchoolLessonRequestPayload,
  IApproveSchoolRequestPayload,
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

  attachLesson(payload: any): Observable<boolean>;
  detachLesson(payload: any): Observable<boolean>;

  // attachSchool(payload: IAttachFieldToSchoolRequestPayload): Observable<boolean>;
  detachSchool(payload: any): Observable<boolean>;

  approveSchool(payload: IApproveSchoolRequestPayload): Observable<boolean>;
  rejectSchool(payload: IRejectSchoolRequestPayload): Observable<boolean>;

  approveSchoolLesson(payload: IApproveSchoolLessonRequestPayload): Observable<boolean>;
  rejectSchoolLesson(payload: IRejectSchoolLessonRequestPayload): Observable<boolean>;
}

export const TEACHER_DETAILS_SERVICE = new InjectionToken<TeacherDetailsService>(
  'TEACHER_DETAILS_SERVICE',
);
