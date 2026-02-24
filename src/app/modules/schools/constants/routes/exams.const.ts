import { NamedRoutes } from '@/core';
import { Routes } from '@angular/router';

export type TSchoolExamsRouteNames = 'exams' | 'exam';
export const schoolExamsNamedRoutes: NamedRoutes<TSchoolExamsRouteNames> = {
  exams: {
    path: 'exams',
    loadComponent: () =>
      import('../../pages/exams/views/exams.component').then((m) => m.SchoolExamsComponent),
    meta: {
      title: 'آزمون‌ها',
      pagePath: () => '/schools/exams',
    },
  },
  exam: {
    path: 'exams/:id',
    loadComponent: () =>
      import('../../pages/exams/views/exam.component').then((m) => m.SchoolExamComponent),
    meta: {
      title: 'آزمون',
      pagePath: (id: string) => `/schools/exams/${id}`,
    },
  },
} as const;

export const SCHOOL_EXAMS_ROUTES: Routes = Object.values(schoolExamsNamedRoutes);
