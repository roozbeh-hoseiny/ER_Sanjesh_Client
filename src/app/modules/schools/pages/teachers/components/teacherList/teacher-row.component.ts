import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ISchoolTeacherMappedData } from '../../models';
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
export class TeacherRowSubheaderComponent {
  @Input() schoolId!: string;
  @Input() item!: ISchoolTeacherMappedData;
  @Output() onSubmitted = new EventEmitter<void>();

  constructor(private store: SchoolTeacherListStore) {}

  detachTeacherLoading = signal<boolean>(false);
  changeTeacherStatusLoading = signal<boolean>(false);
  showLessonForm = signal(false);

  canAddTeacher = computed(() => this.store.canAddTeacher());
  canAddTeacherLesson = computed(() => this.store.canAddTeacherLesson());
  canApproveTeachers = computed(() => this.store.canApproveTeachers());
  selectedLessonIds = computed(() => this.item.lessons?.map((lesson) => lesson.lessonId) || []);

  // start of teacher
  detachTeacher() {
    this.detachTeacherLoading.set(true);
    this.store.detachTeacher(this.item.id).subscribe({
      next: () => {
        this.onSubmitted.emit();
        this.detachTeacherLoading.set(false);
      },

      error: () => {
        this.detachTeacherLoading.set(false);
      },
    });
  }
  // end of teacher

  // start of all lessons of a teacher
  approveAllLessons() {
    this.changeTeacherStatusLoading.set(true);
    this.store
      .approveTeacher({ teacherId: this.item.id, teacherName: this.item.fullname })
      .subscribe({
        next: () => {
          this.onSubmitted.emit();
          this.changeTeacherStatusLoading.set(false);
        },
        error: () => {
          this.changeTeacherStatusLoading.set(false);
        },
      });
  }
  rejectAllLessons() {
    this.changeTeacherStatusLoading.set(true);
    this.store
      .rejectTeacher({ teacherId: this.item.id, teacherName: this.item.fullname })
      .subscribe({
        next: () => {
          this.onSubmitted.emit();
          this.changeTeacherStatusLoading.set(false);
        },
        error: () => {
          this.changeTeacherStatusLoading.set(false);
        },
      });
  }

  // end of all lessons of a school

  openLessonForm() {
    this.showLessonForm.set(true);
  }

  submitted() {
    this.onSubmitted.emit();
  }
}
