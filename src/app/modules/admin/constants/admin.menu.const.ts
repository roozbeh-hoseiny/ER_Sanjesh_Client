import { CategoryIcon } from '@/shared/components/icon';
import { TeacherIcon } from '@/shared/components/icon/icon-teacher.component';
import { MenuItem } from 'primeng/api';
import { adminNamedRoutes } from './admin.routes.const';

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    items: [
      {
        label: 'داشبورد',
        icon: 'pi pi-fw pi-home',
        routerLink: '/admin',
      },

      {
        label: 'مدیریت دبیران',
        customIcon: TeacherIcon,
        routerLink: [adminNamedRoutes.teachers.path],
      },
    ],
  },

  {
    label: 'مدیریت مراکز آموزشی',
    items: [
      {
        label: 'لیست مراکز آموزشی',
        icon: 'pi pi-fw pi-warehouse',
        routerLink: [adminNamedRoutes.schools.path],
      },
      {
        label: 'مدیریت دسته‌بندی‌های مراکز آموزشی',
        customIcon: CategoryIcon,
        routerLink: [adminNamedRoutes.categories.path],
      },
    ],
  },

  {
    label: 'مدیریت اطلاعات پایه',
    items: [
      {
        label: 'پایه‌های تحصیلی',
        icon: 'pi pi-fw pi-database',
        routerLink: [adminNamedRoutes.mdmEducationalLevels.path],
      },
      {
        label: 'رشته‌های تحصیلی دانش‌آموزان',
        icon: 'pi pi-fw pi-database',
        routerLink: [adminNamedRoutes.mdmFieldOfStudies.path],
      },
      {
        label: 'مناطق',
        icon: 'pi pi-fw pi-database',
        routerLink: [adminNamedRoutes.mdmRegions.path],
      },
    ],
  },
];
