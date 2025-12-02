import { InjectionToken } from '@angular/core';

export interface SchoolStudentListService {}

export const SCHOOL_STUDENT_LIST_SERVICE = new InjectionToken<SchoolStudentListService>(
  'SCHOOL_STUDENT_LIST_SERVICE',
);
