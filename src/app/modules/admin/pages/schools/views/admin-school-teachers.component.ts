import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { AdminSchoolsService, AdminTeachersService } from '@/modules/admin/services';
import { LessonsTableComponent, SchoolTeacherListStore } from '@/modules/schools/pages/teachers';
import {
  IApproveAllLessonsRequestPayload,
  IApproveSchoolLessonRequestPayload,
  IRejectAllLessonsRequestPayload,
  IRejectSchoolLessonRequestPayload,
} from '@/modules/teachers/models';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import {
  IAttachLessonToTeacherRequest,
  IDetachLessonFromTeacherRequest,
} from '../../teachers/models';

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
    private schoolService: AdminSchoolsService,
  ) {
    // this.breadcrumbService.setItems([
    //   adminSchoolNamedRoutes.schools.meta,
    //   adminSchoolNamedRoutes.school.meta,
    // ]);
    this.schoolTeacherListStore.setService({
      attachLesson: (payload: IAttachLessonToTeacherRequest) => services.attachLesson(payload),
      detachLesson: (payload: IDetachLessonFromTeacherRequest) => services.detachLesson(payload),

      approveTeacher: (payload: IApproveAllLessonsRequestPayload) =>
        this.services.approveSchool(payload),
      rejectTeacher: (payload: IRejectAllLessonsRequestPayload) =>
        this.services.rejectSchool(payload),

      approveTeacherLesson: (payload: IApproveSchoolLessonRequestPayload) =>
        this.services.approveSchoolLesson(payload),
      rejectTeacherLesson: (payload: IRejectSchoolLessonRequestPayload) =>
        this.services.rejectSchoolLesson(payload),

      getTeacher: (payload) => this.services.byUniqueId(payload),
      detachTeacher: (payload: { teacherId: string; schoolId: string }) =>
        this.services.detachSchool(payload),
    });
    this.getData();
  }

  loading = signal<boolean>(true);
  schoolId = signal(this.route.snapshot.paramMap.get('schoolId')!);

  private getData() {
    this.loading.set(true);
    this.schoolService.getOne(this.schoolId()).subscribe({
      next: (res) => {
        this.setBreadcrumbs(res.name);
      },
      error: () => {
        this.getAll();
      },
      complete: () => {
        this.getAll();
      },
    });
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
        schoolId: this.schoolId(),
        canAddTeacher: true,
        canAddTeacherLesson: true,
        canApproveTeachers: true,
      });
      this.loading.set(false);
    });
  }

  setBreadcrumbs(schoolTitle: string) {
    this.breadcrumbService.setItems([
      { ...adminNamedRoutes.root.meta },
      adminNamedRoutes.schools.meta,
      {
        title: schoolTitle,
      },
      adminNamedRoutes.schoolTeachers.meta,
    ]);
  }

  refreshData() {
    this.getAll();
  }

  onTeacherAssigned() {
    this.getData();
  }
}
