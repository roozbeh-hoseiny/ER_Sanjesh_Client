import { MenuItem } from 'primeng/api';
import { adminNamedRoutes } from './admin.routes.const';

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    items: [
      {
        label: 'داشبورد',
        icon: 'pi pi-fw pi-home',
        routerLink: [adminNamedRoutes.dashboard.path],
      },
    ],
  },
  {
    items: [
      {
        label: 'مدیریت مدارس',
        icon: 'pi pi-fw pi-warehouse',
        routerLink: [adminNamedRoutes.schools.path],
      },
    ],
  },
  {
    items: [
      {
        label: 'مدیریت کاربران',
        icon: 'pi pi-fw pi-users',
        routerLink: [adminNamedRoutes.users.path],
      },
    ],
  },

  {
    label: 'مدیریت اطلاعات',
    items: [
      {
        label: 'اطلاعات پایه دانش‌آموزان',
        items: [
          {
            label: 'پایه‌ی تحصیلی دانش‌آموزان',
            icon: 'pi pi-fw pi-users',
            routerLink: [adminNamedRoutes.mdmEducationalLevels.path],
          },
          {
            label: 'رشته‌های تحصیلی دانش‌آموزان',
            icon: 'pi pi-fw pi-users',
            routerLink: [adminNamedRoutes.mdmFieldOfStudies.path],
          },
        ],
      },
    ],
  },
];
