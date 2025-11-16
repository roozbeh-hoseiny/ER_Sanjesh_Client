import { inject, Injectable, signal } from '@angular/core';
import { ROLES } from 'src/assets/constants';
import { MenuItem, NavigationConfig } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly authService = inject(AuthService);

  readonly isCollapsed = signal(false);

  private readonly navigationConfigs: NavigationConfig[] = [
    {
      role: ROLES.STUDENTS,
      menuItems: [
        {
          key: 'dashboard',
          title: 'داشبورد',
          icon: 'space_dashboard',
          routerLink: '/student/dashboard',
        },
        {
          key: 'exams',
          title: 'آزمون‌ها',
          icon: 'file_text',
          routerLink: '/student/exams',
        },
        {
          key: 'results',
          title: 'نتایج',
          icon: 'bar_chart',
          routerLink: '/student/results',
        },
        {
          key: 'profile',
          title: 'پروفایل',
          icon: 'user',
          routerLink: '/student/profile',
        },
      ],
    },
    {
      role: ROLES.GRADER,
      menuItems: [
        {
          key: 'dashboard',
          title: 'داشبورد',
          icon: 'space_dashboard',
          routerLink: '/grader/dashboard',
        },
        {
          key: 'grading',
          title: 'تصحیح',
          icon: 'edit',
          routerLink: '/grader/grading',
        },
        {
          key: 'assigned-exams',
          title: 'آزمون‌های تخصیص یافته',
          icon: 'file_done',
          routerLink: '/grader/assigned-exams',
        },
        {
          key: 'reports',
          title: 'گزارش‌ها',
          icon: 'bar_chart',
          routerLink: '/grader/reports',
        },
      ],
    },
    {
      role: ROLES.ADMIN,
      menuItems: [
        {
          key: 'dashboard',
          title: 'داشبورد',
          icon: 'space_dashboard',
          routerLink: '/admin/dashboard',
        },
        {
          key: 'users',
          title: 'مدیریت کاربران',
          icon: 'group',
          routerLink: '/admin/users',
        },
        {
          key: 'exams',
          title: 'مدیریت آزمون‌ها',
          icon: 'assignment_turned_in',
          routerLink: '/admin/exams',
        },
        {
          key: 'reports',
          title: 'گزارش‌ها',
          icon: 'bar_chart',
          routerLink: '/admin/reports',
        },
        {
          key: 'settings',
          title: 'تنظیمات',
          icon: 'settings',
          routerLink: '/admin/settings',
        },
      ],
    },
    {
      role: ROLES.SCHOOL,
      menuItems: [
        {
          key: 'dashboard',
          title: 'داشبورد',
          icon: 'space_dashboard',
          routerLink: '/principal/dashboard',
        },
        {
          key: 'schools',
          title: 'مدیریت مراکز آموزشی',
          icon: 'bank',
          routerLink: '/principal/schools',
        },
        {
          key: 'staff',
          title: 'مدیریت کادر',
          icon: 'team',
          routerLink: '/principal/staff',
        },
        {
          key: 'academic-reports',
          title: 'گزارش‌های تحصیلی',
          icon: 'bar_chart',
          routerLink: '/principal/academic-reports',
        },
        {
          key: 'budget',
          title: 'بودجه',
          icon: 'dollar',
          routerLink: '/principal/budget',
        },
      ],
    },
    {
      role: ROLES.SUPERADMIN,
      menuItems: [
        {
          key: 'dashboard',
          title: 'داشبورد',
          icon: 'space_dashboard',
          routerLink: '/superadmin/dashboard',
        },
        {
          key: 'system-management',
          title: 'مدیریت سیستم',
          icon: 'setting',
          children: [
            {
              key: 'users',
              title: 'کاربران',
              routerLink: '/superadmin/users',
            },
            {
              key: 'roles',
              title: 'نقش‌ها',
              routerLink: '/superadmin/roles',
            },
            {
              key: 'permissions',
              title: 'مجوزها',
              routerLink: '/superadmin/permissions',
            },
          ],
        },
        {
          key: 'organizations',
          title: 'سازمان‌ها',
          icon: 'apartment',
          routerLink: '/superadmin/organizations',
        },
        {
          key: 'system-reports',
          title: 'گزارش‌های سیستم',
          icon: 'bar_chart',
          routerLink: '/superadmin/system-reports',
        },
        {
          key: 'logs',
          title: 'لاگ‌ها',
          icon: 'file_text',
          routerLink: '/superadmin/logs',
        },
      ],
    },
  ];

  getMenuItems(): MenuItem[] {
    const currentRole = this.authService.userRole();
    if (!currentRole) return [];

    const config = this.navigationConfigs.find((c) => c.role === currentRole);
    return config?.menuItems || [];
  }

  toggleSidebar(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }
}
