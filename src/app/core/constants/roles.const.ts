import { TRoles } from '../models';

export default {
  ADMIN: {
    title: 'مدیر سیستم',
    key: 'ADMIN',
  },
  SCHOOLS: {
    title: 'مدرسه',
    key: 'SCHOOLS',
  },
  TEACHERS: {
    title: 'دبیر',
    key: 'TEACHERS',
  },
} as Record<TRoles, { title: string; key: TRoles }>;
