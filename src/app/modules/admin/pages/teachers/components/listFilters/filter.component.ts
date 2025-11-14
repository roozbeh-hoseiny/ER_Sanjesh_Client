import { Maybe } from '@/core';
import { LessonsSelectComponent } from '@/shared/catalog';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'admin-teachers-filter',
  templateUrl: './filter.component.html',
  imports: [
    FormsModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    UikitFieldComponent,
    MessageModule,
    ToggleSwitch,
    LessonsSelectComponent,
  ],
})
export class TeachersFilterComponent {
  @Output() onSearch = new EventEmitter<string>();
  @Output() onWithoutSchoolStatusFilter = new EventEmitter<boolean>();
  @Output() onLessonFilter = new EventEmitter<Maybe<number>>();
  @Output() onSchoolFilter = new EventEmitter<Maybe<string>>();

  schoolId = signal<Maybe<string>>('');
  withoutSchoolStatus = signal<boolean>(false);
  selectedLesson = signal<Maybe<number>>(null);
  selectedSchool = signal<Maybe<string>>(null);
  private debounceTimer: any;

  onFilterChange = (schoolId: string) => {
    this.selectedLesson.set(null);
    this.selectedSchool.set(null);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.onSearch.emit(schoolId);
    }, 300);
  };

  clearSearch = () => {
    clearTimeout(this.debounceTimer);
    this.schoolId.set('');
    this.onSearch.emit('');
  };

  onWithoutSchoolStatusChange(withoutSchoolStatus: boolean) {
    this.resetFilters();
    this.withoutSchoolStatus.set(withoutSchoolStatus);
    this.onWithoutSchoolStatusFilter.emit(withoutSchoolStatus);
  }

  onLessonChange(lessonId: Maybe<number>) {
    this.resetFilters();
    this.selectedLesson.set(lessonId);
    this.onLessonFilter.emit(lessonId);
  }

  onSchoolIdChange(schoolId: Maybe<string>) {
    this.resetFilters();
    this.schoolId.set(schoolId);
    this.onSchoolFilter.emit(schoolId);
  }

  resetFilters = () => {
    this.schoolId.set('');
    this.selectedLesson.set(null);
    this.withoutSchoolStatus.set(false);
  };
}
