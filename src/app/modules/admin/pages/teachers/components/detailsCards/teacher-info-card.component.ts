import {
  AppCardComponent,
  CheckVerifiedInfoComponent,
  KeyValueComponent,
} from '@/shared/components';
import { Component, computed } from '@angular/core';
import { TeacherDetailsCardsStore } from './store';

@Component({
  selector: 'app-teacher-info-card',
  templateUrl: './teacher-info-card.component.html',
  imports: [AppCardComponent, KeyValueComponent, CheckVerifiedInfoComponent],
})
export class TeacherInfoCardComponent {
  constructor(private teacherStore: TeacherDetailsCardsStore) {}

  teacher = computed(() => this.teacherStore.teacher());
}
