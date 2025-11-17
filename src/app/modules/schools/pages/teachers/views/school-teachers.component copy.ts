import { Maybe } from '@/core';
import { BreadcrumbService } from '@/core/services';
import { schoolsNamedRoutes } from '@/modules/schools/constants';
import { SchoolsStore } from '@/modules/schools/dataStore';
import { SchoolsTeachersService } from '@/modules/schools/services/schools-teachers.service';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AssignTeacherDialogComponent, LessonsTableComponent } from '../components';
import { ISchoolTeacherMappedData } from '../models';

@Component({
  selector: 'school-teachers',
  standalone: true,
  templateUrl: './school-teachers.component copy.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageDataListComponent,
    ToggleSwitchModule,
    ButtonModule,
    FormsModule,
    AssignTeacherDialogComponent,
    LessonsTableComponent,
    ProgressSpinner,
  ],
})
export class SchoolTeachersComponent {
  private services = inject(SchoolsTeachersService);
  private breadcrumbService = inject(BreadcrumbService);
  private schoolsStore = inject(SchoolsStore);

  @ViewChild('lessons', { static: true }) lessonsTpl!: TemplateRef<any>;
  @ViewChild('actions', { static: true }) actionsTpl!: TemplateRef<any>;

  columns = [] as IColumn[];

  teachers = signal<ISchoolTeacherMappedData[]>([]);
  loading = signal<boolean>(true);
  schoolId = signal(this.schoolsStore.info()?.id!);
  isOpenAssignTeacherDialog = signal<boolean>(false);

  selectedTeacher = signal<Maybe<ISchoolTeacherMappedData>>(null);

  get lessonIdsOfSelectedTeacher() {
    return () => this.selectedTeacher()?.lessons.map((lesson) => lesson.lessonId) || [];
  }

  constructor() {
    this.breadcrumbService.setItems([
      schoolsNamedRoutes.root.meta,
      schoolsNamedRoutes.teachers.meta,
    ]);
    this.getData();
  }

  ngOnInit(): void {
    this.setColumns();
  }

  private setColumns() {
    this.columns = [
      { field: 'fullname', header: 'نام دبیر', width: '14rem' },
      { field: 'mobile', header: 'شماره موبایل', width: '10rem' },
      { field: 'uniqueId', header: 'شناسه', width: '5rem' },
      { field: 'lessons', header: 'درس‌ها', customDataModel: this.lessonsTpl },
      { field: 'action', header: '', width: '12rem', customDataModel: this.actionsTpl },
    ];
  }

  private getData() {
    this.loading.set(true);
    this.getAll();
  }

  private getAll() {
    this.services.getAllMappedData(this.schoolId()).subscribe((teachers) => {
      this.teachers.set(teachers);
      this.loading.set(false);
    });
  }

  openAssignTeacher() {
    this.selectedTeacher.set(null);
    this.isOpenAssignTeacherDialog.set(true);
  }

  openAssignLessonToTeacher(teacher: ISchoolTeacherMappedData) {
    this.selectedTeacher.set(teacher);
    this.isOpenAssignTeacherDialog.set(true);
  }

  onTeacherAssigned() {
    this.getData();
  }
}
