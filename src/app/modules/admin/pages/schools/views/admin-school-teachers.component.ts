import { BreadcrumbService } from '@/core/services';
import { ToastService } from '@/core/services/toast.service';
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
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private toastService: ToastService,
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
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error({
          text: 'مدرسه‌ی مورد نظر یافت نشد',
        });
        this.router.navigate(['admin', 'schools']);
      },
      complete: () => {
        this.getAll();
      },
    });
  }

  private getAll() {
    this.schoolTeacherListStore.fillInitial({
      teachers: [],
      schoolId: this.schoolId(),
      canAddTeacher: true,
      canAddTeacherLesson: true,
      canApproveTeachers: true,
      getTeachersLoading: true,
    });
    this.services.bySchool(this.schoolId()).subscribe({
      next: (teachers) => {
        const mappedTeachers = teachers.map((teacher) => ({
          ...teacher,
          gender: teacher.gender === 'زن' ? false : true,
          fullname: `${teacher.gender ? 'آقای' : 'خانم'} ${teacher.firstName} ${teacher.lastName}`,
        }));
        this.schoolTeacherListStore.setState({
          teachers: mappedTeachers,
          getTeachersLoading: false,
        });
      },
      error: (err) => {
        this.schoolTeacherListStore.setState({ getTeachersLoading: false });
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
