import { ITeacherLesson } from '@/modules/teachers/models';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { AssignTeacherDialogComponent } from './assign-teacher-dialog.component';
import { SchoolTeacherListStore } from './dataStore';

@Component({
  selector: 'teacher-row-subheader',
  templateUrl: './teacher-row.component.html',
  imports: [Button, AssignTeacherDialogComponent],
  host: {
    class: 'w-full',
  },
})
export class lessonSchoolRowSubheaderComponent {
  @Input() teacherId!: string;
  @Input() item!: ITeacherLesson;
  @Input() selectedLessonIds: number[] = [];
  @Output() onSubmitted = new EventEmitter<void>();

  constructor(private store: SchoolTeacherListStore) {}

  detachTeacherSchedules = signal<Record<string, boolean>>({});
  changeTeacherStatusSchedules = signal<Record<string, boolean>>({});
  showLessonForm = signal(false);

  canAddTeacher = computed(() => this.store.canAddTeacher());
  canAddTeacherLesson = computed(() => this.store.canAddTeacherLesson());
  canApproveTeachers = computed(() => this.store.canApproveTeachers());

  // start of teacher
  detachTeacher(item: ITeacherLesson) {
    this.detachTeacherSchedules.update((prev) => ({
      ...prev,
      [item.schoolId]: true,
    }));
    // this.store.detachTeacher(item).subscribe({
    //   next: () => {
    //     this.onSubmitted.emit();
    //     this.removeDetachSchoolFromSchedule(item.schoolId);
    //   },

    //   error: () => {
    //     this.removeDetachSchoolFromSchedule(item.schoolId);
    //   },
    // });
  }

  removeDetachSchoolFromSchedule(schoolId: string) {
    const updatedSchedules = { ...this.detachTeacherSchedules() };
    delete updatedSchedules[schoolId];
    this.detachTeacherSchedules.set(updatedSchedules);
  }
  // end of teacher

  // start of all lessons of a teacher
  approveAllLessons(item: ITeacherLesson) {
    this.changeTeacherStatusSchedules.update((prev) => ({ ...prev, [item.schoolId]: true }));
    // this.store
    //   .approveTeacher({ schoolId: item.schoolId, schoolTitle: item.schoolTitle })
    //   .subscribe({
    //     next: () => {
    //       this.onSubmitted.emit();
    //       this.removeTeacherFromSchedule(item.schoolId);
    //     },
    //     error: () => {
    //       this.removeTeacherFromSchedule(item.schoolId);
    //     },
    //   });
  }
  rejectAllLessons(item: ITeacherLesson) {
    this.changeTeacherStatusSchedules.update((prev) => ({ ...prev, [item.schoolId]: true }));
    // this.store.rejectTeacher({ schoolId: item.schoolId, schoolTitle: item.schoolTitle }).subscribe({
    //   next: () => {
    //     this.onSubmitted.emit();
    //     this.removeTeacherFromSchedule(item.schoolId);
    //   },
    //   error: () => {
    //     this.removeTeacherFromSchedule(item.schoolId);
    //   },
    // });
  }

  removeTeacherFromSchedule(itemId: string) {
    const updatedSchedules = { ...this.changeTeacherStatusSchedules() };
    delete updatedSchedules[itemId];
    this.changeTeacherStatusSchedules.set(updatedSchedules);
  }
  // end of all lessons of a school

  openLessonForm() {
    this.showLessonForm.set(true);
  }

  submitted() {
    this.onSubmitted.emit();
  }
}
