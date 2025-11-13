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
  @Output() onRegionFilter = new EventEmitter<Maybe<number>>();

  search = signal<string>('');
  withoutSchoolStatus = signal<boolean>(false);
  selectedLesson = signal<Maybe<number>>(null);
  selectedSchool = signal<Maybe<number>>(null);
  private debounceTimer: any;

  onFilterChange = (search: string) => {
    this.selectedLesson.set(null);
    this.selectedSchool.set(null);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.onSearch.emit(search);
    }, 300);
  };

  clearSearch = () => {
    clearTimeout(this.debounceTimer);
    this.search.update(() => '');
    this.onSearch.emit('');
  };

  onWithoutSchoolStatusChange(withoutSchoolStatus: boolean) {
    this.resetFilters();
    this.withoutSchoolStatus.set(withoutSchoolStatus);
    this.onWithoutSchoolStatusFilter.emit(withoutSchoolStatus);
  }

  onLessonChange(lessonId: Maybe<number>) {
    console.log(lessonId);

    this.resetFilters();
    this.selectedLesson.set(lessonId);
    this.onLessonFilter.emit(lessonId);
  }

  onRegionChange(regionId: Maybe<number> = null) {
    this.resetFilters();
    this.selectedSchool.set(regionId);
    this.onRegionFilter.emit(regionId);
  }

  resetFilters = () => {
    this.search.set('');
    this.selectedLesson.set(null);
  };
}
