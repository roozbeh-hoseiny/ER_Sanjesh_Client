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
        label: 'مدیریت مدارس',
        icon: 'pi pi-fw pi-warehouse',
        routerLink: [adminNamedRoutes.schools.path],
      },
      {
        label: 'مدیریت دبیران',
        icon: 'pi pi-fw pi-graduation-cap',
        routerLink: [adminNamedRoutes.teachers.path],
      },
    ],
  },

  {
    label: 'مدیریت اطلاعات پایه',
    items: [
      {
        label: 'اطلاعات پایه دانش‌آموزان',
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
      {
        label: 'استان‌ها',
        icon: 'pi pi-fw pi-database',
        routerLink: [adminNamedRoutes.mdmStates.path],
      },
    ],
  },
];
