import { BreadcrumbService } from '@/core/services';
import { AdminTeachersService } from '@/modules/admin/services';
import { schoolsNamedRoutes } from '@/modules/schools/constants';
import { LessonsTableComponent, SchoolTeacherListStore } from '@/modules/schools/pages/teachers';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-admin-school-teachers',
  templateUrl: './admin-school-teachers.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToggleSwitchModule,
    ButtonModule,
    FormsModule,
    ProgressSpinner,
    LessonsTableComponent,
  ],
})
export class AdminSchoolTeachersComponent {
  private route = inject(ActivatedRoute);
  constructor(
    private services: AdminTeachersService,
    private breadcrumbService: BreadcrumbService,
    private schoolTeacherListStore: SchoolTeacherListStore,
  ) {
    this.breadcrumbService.setItems([
      schoolsNamedRoutes.root.meta,
      schoolsNamedRoutes.teachers.meta,
    ]);
    this.getData();
  }

  loading = signal<boolean>(true);
  schoolId = signal(this.route.snapshot.paramMap.get('schoolId')!);

  private getData() {
    this.loading.set(true);
    this.getAll();
  }

  private getAll() {
    this.services.bySchool(this.schoolId()).subscribe((teachers) => {
      const mappedTeachers = teachers.map((teacher) => ({
        ...teacher,
        gender: teacher.gender === 'زن' ? false : true,
        fullname: `${teacher.gender ? 'آقای' : 'خانم'} ${teacher.firstName} ${teacher.lastName}`,
      }));
      this.schoolTeacherListStore.fillInitial({
        teachers: mappedTeachers,
        canAddTeacher: true,
        canAddTeacherLesson: true,
        canApproveTeachers: true,
      });
      this.loading.set(false);
    });
  }

  onTeacherAssigned() {
    this.getData();
  }
}
