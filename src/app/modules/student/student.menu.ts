import { MenuItem } from 'primeng/api';

export const STUDENT_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Student Dashboard',
    icon: 'pi pi-fw pi-user',
    routerLink: ['/student/dashboard'],
  },
  {
    label: 'Courses',
    icon: 'pi pi-fw pi-book',
    routerLink: ['/student/courses'],
  },
];
