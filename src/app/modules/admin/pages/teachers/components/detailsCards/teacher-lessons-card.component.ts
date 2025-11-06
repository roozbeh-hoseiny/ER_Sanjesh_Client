import { AppCardComponent, KeyValueComponent } from '@/shared/components';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ITeacherLesson } from '../../models';
import { TeacherLessonsFormComponent } from './teacher-lessons-form.component';

@Component({
  selector: 'app-teacher-lessons-card',
  templateUrl: './teacher-lessons-card.component.html',
  imports: [AppCardComponent, KeyValueComponent, TeacherLessonsFormComponent],
})
export class TeacherLessonsCardComponent {
  @Input() teacherId!: string;
  @Input() lessons!: ITeacherLesson[];
  @Output() onUpdate = new EventEmitter<void>();

  constructor() {}

  editModeLessons = signal(false);

  onEditLessonsClick = () => {
    this.editModeLessons.update((prev) => !prev);
  };

  lessonsUpdated = () => {
    this.onUpdate.emit();
  };
}
