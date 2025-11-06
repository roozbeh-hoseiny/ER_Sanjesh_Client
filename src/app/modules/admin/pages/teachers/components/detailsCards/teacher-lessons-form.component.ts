import { Maybe } from '@/core';
import { AdminSchoolSelectComponent } from '@/modules/admin/pages/schools/components/admin-school-select.component';
import { AdminTeachersService } from '@/modules/admin/services';
import { ISchoolResponse } from '@/modules/schools/models';
import { ILessonsInRoot, LessonsSelectComponent } from '@/shared/catalog';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { ITeacherLesson } from '../../models';

export interface ISelectedSchoolLessons {
  id: string;
  schoolId: string;
  schoolTitle: string;
  lessonId: string;
  lessonTitle: string;
}

@Component({
  selector: 'app-teacher-lessons-form',
  templateUrl: './teacher-lessons-form.component.html',
  imports: [AdminSchoolSelectComponent, LessonsSelectComponent, ButtonDirective],
})
export class TeacherLessonsFormComponent {
  @Input() teacherId!: string;
  @Input() selectedSchoolLessons!: ITeacherLesson[];
  @Output() onUpdate = new EventEmitter<void>();

  selectedSchool = new FormControl<Maybe<ISchoolResponse>>(null);
  selectedLesson = new FormControl<Maybe<ILessonsInRoot>>(null);

  attachLoading = signal<boolean>(false);
  detachLoading = signal<boolean>(false);

  filteredLessenIds = signal<string[]>([]);

  attach() {
    const school = this.selectedSchool.value;
    const lesson = this.selectedLesson.value;

    if (school && lesson) {
      const schoolId = school.id;
      const lessonId = lesson.id;

      this.attachLoading.set(true);
      this.service
        .attachLesson({
          id: this.teacherId,
          schoolId,
          lessonId,
        })
        .subscribe({
          next: () => {
            this.selectedSchool.reset();
            this.selectedLesson.reset();
            this.attachLoading.set(false);
            this.onUpdate.emit();
          },
          error: () => {
            this.attachLoading.set(false);
          },
        });
    }
  }

  // this.selectedSchoolLessons.set(this.selectedSchoolLessons().filter((item) => item.id !== id));

  updateLessonsFilter() {
    if (this.selectedSchool.value) {
      this.filteredLessenIds.set(
        this.selectedSchoolLessons
          .filter((item) => item.schoolId === this.selectedSchool.value?.id)
          .map((item) => item.lessonId.toString()),
      );
    } else {
      this.filteredLessenIds.set([]);
    }
  }

  constructor(private service: AdminTeachersService) {
    this.selectedSchool.valueChanges.subscribe(() => {
      this.updateLessonsFilter();
    });
  }
}
