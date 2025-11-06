import { AdminTeachersService } from '@/modules/admin/services';
import { AppCardComponent, KeyValueComponent } from '@/shared/components';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { ITeacherLesson, ITeacherLessonGroupedBySchool } from '../../models';
import { TeacherLessonsFormComponent } from './teacher-lessons-form.component';

@Component({
  selector: 'app-teacher-lessons-card',
  templateUrl: './teacher-lessons-card.component.html',
  imports: [
    AppCardComponent,
    TeacherLessonsFormComponent,
    Divider,
    ButtonDirective,
    KeyValueComponent,
  ],
})
export class TeacherLessonsCardComponent {
  @Input() teacherId!: string;
  // make lessons reactive so computed selectors re-evaluate when parent updates the input
  private lessonsSignal = signal<ITeacherLesson[]>([]);

  @Input()
  set lessons(v: ITeacherLesson[]) {
    this.lessonsSignal.set(v ?? []);
  }

  get lessons() {
    return this.lessonsSignal();
  }
  @Output() onUpdate = new EventEmitter<void>();

  constructor(private service: AdminTeachersService) {}

  editModeLessons = signal(false);
  detachLoading = signal(false);

  lessonsGroupedBySchool = computed(() => {
    const lessons = this.lessonsSignal();
    const groupedBySchools = lessons.reduce(
      (acc, lesson) => {
        const schoolId = lesson.schoolId;
        if (!acc[schoolId]) {
          acc[schoolId] = {
            schoolId: schoolId,
            schoolTitle: lesson.schoolTitle,
            lessons: [] as ITeacherLesson[],
          };
        }
        acc[schoolId].lessons.push(lesson);
        return acc;
      },
      {} as Record<string, ITeacherLessonGroupedBySchool>,
    );
    return Object.values(groupedBySchools);
  });

  onEditLessonsClick = () => {
    this.editModeLessons.update((prev) => !prev);
  };

  detach({ schoolId, lessonId }: { schoolId: string; lessonId: number }) {
    this.detachLoading.set(true);
    this.service
      .detachLesson({
        id: this.teacherId,
        schoolId,
        lessonId,
      })
      .subscribe({
        next: () => {
          this.detachLoading.set(false);
          this.onUpdate.emit();
        },
        error: () => {
          this.detachLoading.set(false);
        },
      });
  }

  lessonsUpdated = () => {
    this.onUpdate.emit();
  };
}
