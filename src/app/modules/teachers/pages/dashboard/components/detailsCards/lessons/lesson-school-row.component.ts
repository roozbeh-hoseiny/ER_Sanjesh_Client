import { ITeacherLesson } from '@/modules/teachers/models';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { TeacherDetailsCardsStore } from '../dataStore';
import { AttachSchoolLessonFormDialogComponent } from './attach-lesson-form.component';

@Component({
  selector: 'lesson-school-row-subheader',
  templateUrl: './lesson-school-row.component.html',
  imports: [Button, AttachSchoolLessonFormDialogComponent],
  host: {
    class: 'w-full',
  },
})
export class lessonSchoolRowSubheaderComponent {
  @Input() teacherId!: string;
  @Input() item!: ITeacherLesson;
  @Input() selectedLessonIds: number[] = [];
  @Output() onSubmitted = new EventEmitter<void>();

  constructor(private store: TeacherDetailsCardsStore) {}

  detachSchoolSchedules = signal<Record<string, boolean>>({});
  changeSchoolStatusSchedules = signal<Record<string, boolean>>({});
  showLessonForm = signal(false);

  canAddSchoolLesson = computed(() => this.store.canAddSchoolLesson());
  canApproveSchools = computed(() => this.store.canApproveSchools());

  // start of school
  detachSchool(item: ITeacherLesson) {
    this.detachSchoolSchedules.update((prev) => ({
      ...prev,
      [item.schoolId]: true,
    }));
    this.store.detachSchool(item).subscribe({
      next: () => {
        this.onSubmitted.emit();
        this.removeDetachSchoolFromSchedule(item.schoolId);
      },

      error: () => {
        this.removeDetachSchoolFromSchedule(item.schoolId);
      },
    });
  }

  removeDetachSchoolFromSchedule(schoolId: string) {
    const updatedSchedules = { ...this.detachSchoolSchedules() };
    delete updatedSchedules[schoolId];
    this.detachSchoolSchedules.set(updatedSchedules);
  }
  // end of school

  // start of all lessons of a school
  approveAllLessons(item: ITeacherLesson) {
    this.changeSchoolStatusSchedules.update((prev) => ({ ...prev, [item.schoolId]: true }));
    this.store.approveSchool({ schoolId: item.schoolId, schoolTitle: item.schoolTitle }).subscribe({
      next: () => {
        this.onSubmitted.emit();
        this.removeSchoolFromSchedule(item.schoolId);
      },
      error: () => {
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
      error: () => {
        this.removeSchoolFromSchedule(item.schoolId);
      },
    });
  }

  removeSchoolFromSchedule(itemId: string) {
    const updatedSchedules = { ...this.changeSchoolStatusSchedules() };
    delete updatedSchedules[itemId];
    this.changeSchoolStatusSchedules.set(updatedSchedules);
  }
  // end of all lessons of a school

  openLessonForm() {
    this.showLessonForm.set(true);
  }

  submitted() {
    this.onSubmitted.emit();
  }
}
