import { ISchoolContactRequest } from '@/modules/schools/models';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { TeacherDetailsCardsStore } from './dataStore/store';
import { TeacherInfoComponent } from './info/teacher-info.component';
import { LessonsTableComponent } from './lessons/lessons-table.component';
import { TeacherLoginInfoComponent } from './login-info.component';

@Component({
  selector: 'teacher-details',
  templateUrl: './teacher-details.component.html',
  imports: [TeacherInfoComponent, TeacherLoginInfoComponent, LessonsTableComponent],
})
export class TeacherDetailsComponent {
  private detailsStore = inject(TeacherDetailsCardsStore);

  @Output() onRefreshData = new EventEmitter<void>();
  @Output() onSubmitContact = new EventEmitter<ISchoolContactRequest>();

  teacherId = signal<string>('');

  get info() {
    return this.detailsStore.info();
  }
  get canEditLoginInfo() {
    return this.detailsStore.canEditLoginInfo();
  }

  constructor() {
    const cur = this.detailsStore.info();
    if (cur) this.teacherId.set(cur.id);
  }

  refreshData() {
    this.onRefreshData.emit();
  }
}
