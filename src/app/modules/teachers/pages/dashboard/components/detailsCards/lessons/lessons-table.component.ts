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
  changeSchoolStatusSchedules = signal<Record<string, boolean>>({});
  detachLessonsSchedules = signal<Record<string, boolean>>({});
  detachSchoolSchedules = signal<Record<string, boolean>>({});
  lessons = computed(() => this.store.info()?.lessons!);
  canApproveSchools = computed(() => this.store.canApproveSchools());

  ngOnInit() {
    this.setColumns();
  }

  private setColumns() {
    this.columns = [
      { field: 'lessonTitle', header: 'عنوان درس', minWidth: '15rem' },
      { field: 'fieldOfStudyTitle', header: 'رشته', minWidth: '15rem' },
      { field: 'educationalLevelTitle', header: 'پایه', minWidth: '15rem' },
      // { field: 'schoolTitle', header: 'مدرسه', minWidth: '15rem' },
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
    this.changeStatusSchedules.update((prev) => ({ ...prev, [item.lessonId]: true }));
    this.confirmationService.confirm({
      target: (event.originalEvent.target as HTMLElement)?.parentNode?.parentNode!,
      message: !checked
        ? 'آیا از غیرفعال کردن این درس در این مدرسه اطمینان دارید؟'
        : 'آیا از فعال کردن این درس در این مدرسه اطمینان دارید؟',
      header: 'تایید تغییر وضعیت',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'بله',
      rejectLabel: 'خیر',
      accept: () => this.toggleSchoolLessonStatus(item, checked),
      reject: () => {
        this.removeLessonFromSchedule(item.lessonId);
      },
    });
  }

  toggleSchoolLessonStatus(item: ITeacherLesson, checked: boolean) {
    this.store
      .changeSchoolLessonStatus({
        teacherLessonId: item.lessonId,
        schoolTitle: item.schoolTitle,
        teacherLessonTitle: item.lessonTitle,
        isActive: checked,
      })
      .subscribe({
        next: () => {
          item.approved = checked;
          this.removeLessonFromSchedule(item.lessonId);
        },
        error: () => {
          this.removeLessonFromSchedule(item.lessonId);
          item.approved = !checked;
        },
      });
  }

  removeLessonFromSchedule(itemId: number) {
    const updatedSchedules = { ...this.changeStatusSchedules() };
    delete updatedSchedules[itemId];
    this.changeStatusSchedules.update(() => updatedSchedules);
  }

  approveAllLessons(item: ITeacherLesson) {
    this.changeSchoolStatusSchedules.update((prev) => ({ ...prev, [item.schoolId]: true }));
    this.store.approveSchool({ schoolId: item.schoolId, schoolTitle: item.schoolTitle }).subscribe({
      next: () => {
        this.onSubmitted.emit();
        this.removeSchoolFromSchedule(item.schoolId);
      },
    });
  }
  rejectAllLessons(item: ITeacherLesson) {
    this.changeSchoolStatusSchedules.update((prev) => ({ ...prev, [item.schoolId]: true }));
    this.store.rejectSchool({ schoolId: item.schoolId, schoolTitle: item.schoolTitle }).subscribe({
      next: () => {
        this.onSubmitted.emit();
        this.removeSchoolFromSchedule(item.schoolId);
      },
    });
  }

  removeSchoolFromSchedule(itemId: string) {
    const updatedSchedules = { ...this.changeSchoolStatusSchedules() };
    delete updatedSchedules[itemId];
    this.changeSchoolStatusSchedules.set(updatedSchedules);
  }

  detachLesson(item: ITeacherLesson) {
    this.detachLessonsSchedules.update((prev) => ({
      ...prev,
      [`${item.lessonId}-${item.schoolId}`]: true,
    }));
    console.log('asdadasdas');
    this.store.detachLesson(item).subscribe({
      next: () => {
        console.log('first');
        this.onSubmitted.emit();
        this.removeDetachLessonFromSchedule(item);
      },
    });
  }

  removeDetachLessonFromSchedule(item: ITeacherLesson) {
    const updatedSchedules = { ...this.detachLessonsSchedules() };
    delete updatedSchedules[`${item.lessonId}-${item.schoolId}`];
    this.detachLessonsSchedules.set(updatedSchedules);
  }

  detachSchool(item: ITeacherLesson) {
    this.detachSchoolSchedules.update((prev) => ({
      ...prev,
      [item.schoolId]: true,
    }));
    this.store.detachSchool(item).subscribe({
      next: () => {
        this.onSubmitted.emit();
        this.removeSchoolFromSchedule(item.schoolId);
      },
    });
  }

  removeDetachSchoolFromSchedule(schoolId: string) {
    const updatedSchedules = { ...this.detachSchoolSchedules() };
    delete updatedSchedules[schoolId];
    this.detachSchoolSchedules.set(updatedSchedules);
  }
}
