import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SchoolStudentListStore } from './dataStore';

@Component({
  selector: 'school-students-table',
  templateUrl: './students-table.component.html',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    ToggleSwitchModule,
    FormsModule,
    CommonModule,
    TableModule,
    PanelModule,
    PageDataListComponent,
  ],
})
export class StudentsTableComponent {
  @Input() loading = false;
  @Output() onSubmitted = new EventEmitter<void>();

  constructor(private store: SchoolStudentListStore) {}

  columns = [] as IColumn[];
  changeStatusSchedules = signal<Record<number, boolean>>({});
  detachLessonsSchedules = signal<Record<string, boolean>>({});
  showLessonForm = signal(false);

  students = computed(() => this.store.students() || []);
  schoolId = computed(() => this.store.schoolId() || '');

  ngOnInit() {
    this.setColumns();
  }

  private setColumns() {
    this.columns = [];
  }

  onSubmit() {
    this.onSubmitted.emit();
  }
  submittedNewTeacher() {
    this.onSubmit();
  }
}
