import { BreadcrumbService } from '@/core/services';
import { LayoutService } from '@/layout/service/layout.service';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { AdminTeachersService } from '@/modules/admin/services';
import {
  IApproveSchoolLessonRequestPayload,
  IApproveSchoolRequestPayload,
  IRejectSchoolLessonRequestPayload,
  IRejectSchoolRequestPayload,
} from '@/modules/teachers/models';
import {
  TeacherDetailsCardsStore,
  TeacherDetailsComponent,
} from '@/modules/teachers/pages/dashboard/components';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-admin-teacher',
  templateUrl: './admin-teacher.component.html',
  imports: [ProgressSpinner, TeacherDetailsComponent],
})
export class AdminTeacherComponent {
  teacherId = signal<string>('');
  initLoading = signal<boolean>(true);

  constructor(
    private teacherService: AdminTeachersService,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private teacherCardStore: TeacherDetailsCardsStore,
  ) {
    this.layoutService.changeIsFixedContentSize(true);
    this.teacherCardStore.setService({
      approveSchool: (payload: IApproveSchoolRequestPayload) =>
        this.teacherService.approveSchool(payload),
      rejectSchool: (payload: IRejectSchoolRequestPayload) =>
        this.teacherService.rejectSchool(payload),
      approveSchoolLesson: (payload: IApproveSchoolLessonRequestPayload) =>
        this.teacherService.approveSchoolLesson(payload),
      rejectSchoolLesson: (payload: IRejectSchoolLessonRequestPayload) =>
        this.teacherService.rejectSchoolLesson(payload),
    });
    this.teacherCardStore.fillInitial({
      canApproveSchools: true,
    });
    this.teacherId.set(this.route.snapshot.paramMap.get('teacherId') || '');
  }

  ngOnInit() {
    this.loadTeacher();
  }

  ngOnDestroy() {
    this.layoutService.changeIsFixedContentSize(false);
  }

  refreshData() {
    this.loadTeacher();
  }

  setBreadcrumb() {
    this.breadcrumbService.setItems([
      adminNamedRoutes.root.meta,
      adminNamedRoutes.teachers.meta,
      {
        title: `${this.teacherCardStore.info()?.firstName} ${this.teacherCardStore.info()?.lastName}`,
      },
    ]);
  }

  loadTeacher() {
    return this.teacherService.byId(this.teacherId()).subscribe((teacher) => {
      this.teacherCardStore.setState({ info: teacher });
      this.setBreadcrumb();
      this.initLoading.set(false);
    });
  }

  // onSubmitContact(payload: ISchoolContactRequest) {
  //   this.teacherService.updateContact({ ...payload, id: this.teacherId() }).subscribe({
  //     next: (value) => {
  //       this.submitContactLoading.set(false);
  //       this.toastService.success({ text: 'اطلاعات رابط مدرسه با موفقیت به‌روزرسانی شد.' });
  //       this.loadSchool();
  //     },
  //     error: (err) => {
  //       this.submitContactLoading.set(false);
  //     },
  //   });
  // }
}
