import { BreadcrumbService } from '@/core/services';
import { ToastService } from '@/core/services/toast.service';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { AdminSchoolsService } from '@/modules/admin/services';
import { AdminSchoolsStudentsService } from '@/modules/admin/services/students.service';
import { SchoolStudentsManagementStore } from '@/modules/schools/pages/students';
import { SharedSchoolStudentsComponent } from '@/modules/schools/shared/students/components/list/list.component';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-school-students',
  templateUrl: './list.component.html',
  imports: [SharedSchoolStudentsComponent],
})
export class AdminSchoolStudentsComponent {
  private schoolStudentsManagementStore = inject(SchoolStudentsManagementStore);
  private studentsServices = inject(AdminSchoolsStudentsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private schoolService = inject(AdminSchoolsService);
  private toastService = inject(ToastService);
  private breadcrumbService = inject(BreadcrumbService);

  schoolId = signal(this.route.snapshot.params['schoolId']);
  initLoading = signal(true);

  constructor() {
    this.getData();
    this.schoolStudentsManagementStore.getAllService = (payload) =>
      this.studentsServices.getAll({ ...payload, id: this.schoolId() });

    this.schoolStudentsManagementStore.unassignStudentService = (payload) =>
      this.studentsServices.unassign(payload);

    this.schoolStudentsManagementStore.setState({
      schoolId: this.schoolId(),
      canAddBulkStudents: false,
      canAddStudent: false,
    });
  }

  private getData() {
    this.initLoading.set(true);
    this.schoolService.getOne(this.schoolId()).subscribe({
      next: (res) => {
        this.setBreadcrumbs(res.name);
        this.initLoading.set(false);
      },
      error: () => {
        this.toastService.error({
          text: 'مدرسه‌ی مورد نظر یافت نشد',
        });
        this.router.navigate(['admin', 'schools']);
      },
    });
  }

  setBreadcrumbs(schoolTitle: string) {
    this.breadcrumbService.setItems([
      { ...adminNamedRoutes.root.meta, routerLink: ['/admin'] },
      { ...adminNamedRoutes.schools.meta, routerLink: ['/admin', 'schools'] },
      {
        title: schoolTitle,
        routerLink: ['/admin', 'schools', this.schoolId()],
      },
      adminNamedRoutes.schoolStudents.meta,
    ]);
  }
}
