import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface SchoolStudentListService {
  addBulk(payload: FormData): Observable<any>;
}

export const SCHOOL_STUDENT_LIST_SERVICE = new InjectionToken<SchoolStudentListService>(
  'SCHOOL_STUDENT_LIST_SERVICE',
);
