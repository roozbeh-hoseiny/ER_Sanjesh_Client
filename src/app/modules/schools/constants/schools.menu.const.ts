import { MenuItem } from 'primeng/api';
import { schoolsNamedRoutes } from './schools.routes.const';

export const SCHOOLS_MENU_ITEMS: MenuItem[] = [
  {
    items: [
      {
        label: 'داشبورد',
        icon: 'pi pi-fw pi-home',
        routerLink: '/schools',
      },
      {
        label: 'دبیران',
        icon: 'pi pi-fw pi-graduation-cap',
        routerLink: schoolsNamedRoutes.teachers.path,
      },
    ],
  },
];
