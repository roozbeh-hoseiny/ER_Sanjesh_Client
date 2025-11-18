import { ITeacherLesson } from '@/modules/teachers/models';
import { AppCardComponent } from '@/shared/components';
import { IColumn } from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  Output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToggleSwitchChangeEvent, ToggleSwitchModule } from 'primeng/toggleswitch';
import { TeacherDetailsCardsStore } from '../dataStore';
import { AttachSchoolLessonFormDialogComponent } from './attach-lesson-form.component';
import { lessonSchoolRowSubheaderComponent } from './lesson-school-row.component';

@Component({
  selector: 'app-teacher-lessons-table',
  templateUrl: './lessons-table.component.html',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    AppCardComponent,
    ConfirmPopup,
    ProgressSpinner,
    ToggleSwitchModule,
    FormsModule,
    CommonModule,
    Badge,
    TableModule,
    Button,
    lessonSchoolRowSubheaderComponent,
    AttachSchoolLessonFormDialogComponent,
  ],
})
export class LessonsTableComponent {
  @Output() onSubmitted = new EventEmitter<void>();

  constructor(
    private store: TeacherDetailsCardsStore,
    private confirmationService: ConfirmationService,
  ) {}

  @ViewChild('status', { static: true }) statusTpl!: TemplateRef<any>;

  columns = [] as IColumn[];
  changeStatusSchedules = signal<Record<number, boolean>>({});
  detachLessonsSchedules = signal<Record<string, boolean>>({});
  showLessonForm = signal(false);

  lessons = computed(() => this.store.info()?.lessons!);
  teacherId = computed(() => this.store.info()?.id!);
  canApproveSchools = computed(() => this.store.canApproveSchools());
  canAddSchoolLesson = computed(() => this.store.canAddSchoolLesson());

  ngOnInit() {
    this.setColumns();
  }

  private setColumns() {
    this.columns = [
      { field: 'lessonTitle', header: 'عنوان درس', minWidth: '15rem' },
      { field: 'fieldOfStudyTitle', header: 'رشته', minWidth: '15rem' },
      { field: 'educationalLevelTitle', header: 'پایه', minWidth: '15rem' },
      // { field: 'schoolTitle', header: 'مرکز آموزشی', minWidth: '15rem' },
    ];
    if (this.canApproveSchools()) {
      this.columns.push({
        field: 'approved',
        header: '',
        customDataModel: this.statusTpl,
        width: '12rem',
        minWidth: '12rem',
      });
    } else {
      this.columns.push({
        field: 'approved',
        header: 'وضعیت',
        customDataModel: this.statusTpl,
        width: '5rem',
        minWidth: '5rem',
      });
    }
  }

  showSchoolLessonConfirmation(
    item: ITeacherLesson,
    checked: boolean,
    event: ToggleSwitchChangeEvent,
  ) {
    this.changeStatusSchedules.update((prev) => ({ ...prev, [item.id]: true }));
    this.confirmationService.confirm({
      target: (event.originalEvent.target as HTMLElement)?.parentNode?.parentNode!,
      message: !checked
        ? 'آیا از غیرفعال کردن این درس در این مرکز آموزشی اطمینان دارید؟'
        : 'آیا از فعال کردن این درس در این مرکز آموزشی اطمینان دارید؟',
      header: 'تایید تغییر وضعیت',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'بله',
      rejectLabel: 'خیر',
      accept: () => this.toggleSchoolLessonStatus(item, checked),
      reject: () => {
        this.removeLessonFromSchedule(item.id);
      },
    });
  }

  toggleSchoolLessonStatus(item: ITeacherLesson, checked: boolean) {
    this.store
      .changeSchoolLessonStatus({
        teacherLessonId: item.id,
        schoolTitle: item.schoolTitle,
        teacherLessonTitle: item.lessonTitle,
        isActive: checked,
      })
      .subscribe({
        next: () => {
          item.approved = checked;
          this.removeLessonFromSchedule(item.id);
        },
        error: () => {
          this.removeLessonFromSchedule(item.id);
          item.approved = !checked;
        },
      });
  }

  removeLessonFromSchedule(itemId: number) {
    const updatedSchedules = { ...this.changeStatusSchedules() };
    delete updatedSchedules[itemId];
    this.changeStatusSchedules.update(() => updatedSchedules);
  }

  detachLesson(item: ITeacherLesson) {
    this.detachLessonsSchedules.update((prev) => ({
      ...prev,
      [`${item.id}-${item.schoolId}`]: true,
    }));
    this.store.detachLesson(item).subscribe({
      next: () => {
        this.onSubmitted.emit();
        this.removeDetachLessonFromSchedule(item);
      },
    });
  }

  removeDetachLessonFromSchedule(item: ITeacherLesson) {
    const updatedSchedules = { ...this.detachLessonsSchedules() };
    delete updatedSchedules[`${item.id}-${item.schoolId}`];
    this.detachLessonsSchedules.set(updatedSchedules);
  }

  getLessonIds(item: ITeacherLesson) {
    return this.lessons()
      .filter((lesson) => lesson.schoolId === item.schoolId)
      .map((lesson) => lesson.lessonId);
  }

  openAttachLessonDialog() {
    this.showLessonForm.set(true);
  }

  onSubmit() {
    this.onSubmitted.emit();
  }
  submittedNewSchoolLesson() {
    this.onSubmit();
  }
}
