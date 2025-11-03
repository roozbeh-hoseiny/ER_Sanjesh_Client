import { TRoles } from '../models';

export default {
  ADMIN: {
    title: 'مدیر سیستم',
    key: 'ADMIN',
  },
  SCHOOL: {
    title: 'مدرسه',
    key: 'SCHOOL',
  },
  TEACHERS: {
    title: 'دبیر',
    key: 'TEACHERS',
  },
  STUDENTS: {
    title: 'دانش‌آموز',
    key: 'STUDENTS',
  },
} as Record<TRoles, { title: string; key: TRoles }>;
