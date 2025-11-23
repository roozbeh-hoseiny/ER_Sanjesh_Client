import { ITeacherLesson } from '@/modules/teachers/models';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { TeacherDetailsCardsStore } from '../dataStore';
import { AttachSchoolLessonFormDialogComponent } from './attach-lesson-form.component';

@Component({
  selector: 'lesson-school-row-subheader',
  templateUrl: './lesson-school-row.component.html',
  imports: [AttachSchoolLessonFormDialogComponent, Menu, ButtonDirective],
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

  menuItems = computed(() => {
    const items = [];
    if (this.canAddSchoolLesson()) {
      items.push({
        label: 'افزودن درس',
        icon: 'pi pi-plus',
        command: () => this.openLessonForm(),
      });
      items.push({
        label: 'حذف مرکز آموزشی',
        icon: 'pi pi-trash',
        command: () => this.detachSchool(this.item),
      });
    }
    if (this.canApproveSchools()) {
      items.push({
        label: 'تایید همه دروس مرکز آموزشی',
        icon: 'pi pi-check',
        command: () => this.approveAllLessons(this.item),
      });
      items.push({
        label: 'رد همه دروس مرکز آموزشی',
        icon: 'pi pi-times',
        command: () => this.rejectAllLessons(this.item),
      });
    }
    return items;
  });

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
    this.store
      .approveAllLessons({ schoolId: item.schoolId, schoolTitle: item.schoolTitle })
      .subscribe({
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
    this.store
      .rejectAllLessons({ schoolId: item.schoolId, schoolTitle: item.schoolTitle })
      .subscribe({
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
