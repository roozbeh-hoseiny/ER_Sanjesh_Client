import { BreadcrumbService } from '@/core/services';
import { LayoutService } from '@/layout/service/layout.service';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { AdminTeachersService } from '@/modules/admin/services';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TeacherDetailsCardsStore } from '../components/detailsCards/store';
import { TeacherInfoCardComponent } from '../components/detailsCards/teacher-info-card.component';
import { TeacherLessonsCardComponent } from '../components/detailsCards/teacher-lessons-card.component';

@Component({
  selector: 'app-admin-teacher',
  templateUrl: './admin-teacher.component.html',
  imports: [ProgressSpinner, TeacherLessonsCardComponent, TeacherInfoCardComponent],
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
    this.teacherId.set(this.route.snapshot.paramMap.get('teacherId') || '');
  }

  get lessons() {
    return this.teacherCardStore.teacher()?.lessons || [];
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
        title: this.teacherCardStore.teacher()?.fullname,
      },
    ]);
  }

  loadTeacher() {
    return this.teacherService.byId(this.teacherId()).subscribe((teacher) => {
      this.teacherCardStore.setState({ teacher });
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
