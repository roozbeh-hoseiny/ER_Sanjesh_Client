import { TRoles } from '../models';

export default {
  ADMIN: {
    title: 'مدیر سیستم',
    key: 'ADMIN',
  },
  SCHOOL: {
    title: 'مرکز آموزشی',
    key: 'SCHOOL',
  },
  TEACHER: {
    title: 'دبیر',
    key: 'TEACHER',
  },
  STUDENTS: {
    title: 'دانش‌آموز',
    key: 'STUDENTS',
  },
} as Record<TRoles, { title: string; key: TRoles }>;
