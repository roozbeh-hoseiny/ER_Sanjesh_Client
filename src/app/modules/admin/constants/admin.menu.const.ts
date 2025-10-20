import { MenuItem } from 'primeng/api';
import { adminNamedRoutes } from './admin.routes.const';

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    items: [
      {
        label: 'داشبورد',
        icon: 'pi pi-fw pi-home',
        routerLink: [adminNamedRoutes.root.path],
      },
      {
        label: 'مدیریت مدارس',
        icon: 'pi pi-fw pi-warehouse',
        routerLink: [adminNamedRoutes.schools.path],
      },
      {
        label: 'مدیریت دانش‌اموزان',
        icon: 'pi pi-fw pi-users',
        routerLink: [adminNamedRoutes.users.path],
      },
    ],
  },

  {
    label: 'مدیریت اطلاعات پایه',
    items: [
      {
        label: 'اطلاعات پایه دانش‌آموزان',
        icon: 'pi pi-fw pi-users',
        routerLink: [adminNamedRoutes.mdmEducationalLevels.path],
      },
      {
        label: 'رشته‌های تحصیلی دانش‌آموزان',
        icon: 'pi pi-fw pi-users',
        routerLink: [adminNamedRoutes.mdmFieldOfStudies.path],
      },
      {
        label: 'مناطق',
        icon: 'pi pi-fw pi-users',
        routerLink: [adminNamedRoutes.mdmRegions.path],
      },
      {
        label: 'استان‌ها',
        icon: 'pi pi-fw pi-users',
        routerLink: [adminNamedRoutes.mdmStates.path],
      },
    ],
  },
];
