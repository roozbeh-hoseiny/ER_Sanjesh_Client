import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'school-students-list',
  templateUrl: './list.component.html',
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
export class SchoolStudentsListComponent {
  @Input() loading = false;
  @Input() students!: any;
  @Input() schoolId!: string;
  @Output() onSubmitted = new EventEmitter<void>();

  columns = [] as IColumn[];
  changeStatusSchedules = signal<Record<number, boolean>>({});
  detachLessonsSchedules = signal<Record<string, boolean>>({});
  showLessonForm = signal(false);

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
