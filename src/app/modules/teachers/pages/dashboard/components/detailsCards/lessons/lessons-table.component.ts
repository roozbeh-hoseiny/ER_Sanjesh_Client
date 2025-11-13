import { ITeacherLesson } from '@/modules/teachers/models';
import { AppCardComponent } from '@/shared/components';
import { IColumn } from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, computed, signal, TemplateRef, ViewChild } from '@angular/core';
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
  constructor(
    private store: TeacherDetailsCardsStore,
    private confirmationService: ConfirmationService,
  ) {}
  @ViewChild('status', { static: true }) statusTpl!: TemplateRef<any>;

  columns = [] as IColumn[];
  changeStatusSchedules = signal<Record<number, boolean>>({});
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
      {
        field: 'approved',
        header: 'وضعیت',
        customDataModel: this.statusTpl,
        width: '6.5rem',
        minWidth: '6.5rem',
      },
    ];
  }

  showConfirmation(item: ITeacherLesson, checked: boolean, event: ToggleSwitchChangeEvent) {
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
      accept: () => this.toggleStatus(item, checked),
      reject: () => {
        this.removeLessonFromSchedule(item.lessonId);
      },
    });
  }

  toggleStatus(item: ITeacherLesson, checked: boolean) {
    this.store.changeSchoolStatus(item.schoolId, item.schoolTitle, checked).subscribe({
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
}
