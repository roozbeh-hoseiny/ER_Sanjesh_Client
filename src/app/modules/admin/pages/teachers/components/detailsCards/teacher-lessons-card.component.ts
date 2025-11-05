import { AppCardComponent, KeyValueComponent } from '@/shared/components';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-teacher-lessons-card',
  templateUrl: './teacher-lessons-card.component.html',
  imports: [AppCardComponent, KeyValueComponent],
})
export class TeacherLessonsCardComponent {
  constructor() {}

  editModeLessons = signal(false);

  onEditLessonsClick = () => {
    this.editModeLessons.update((prev) => !prev);
  };
}
