import { BreadcrumbService } from '@/core/services';
import { schoolsNamedRoutes } from '@/modules/schools/constants';
import { SchoolsStore } from '@/modules/schools/dataStore';
import { SchoolsTeachersService } from '@/modules/schools/services/schools-teachers.service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { LessonsTableComponent, SchoolTeacherListStore } from '../components';

@Component({
  selector: 'school-teachers',
  standalone: true,
  templateUrl: './school-teachers.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToggleSwitchModule,
    ButtonModule,
    FormsModule,
    LessonsTableComponent,
    ProgressSpinner,
  ],
})
export class SchoolTeachersComponent {
  private schoolsStore = inject(SchoolsStore);
  constructor(
    private services: SchoolsTeachersService,
    private breadcrumbService: BreadcrumbService,
    private schoolTeacherListStore: SchoolTeacherListStore,
  ) {
    this.breadcrumbService.setItems([
      schoolsNamedRoutes.root.meta,
      schoolsNamedRoutes.teachers.meta,
    ]);
    this.getData();
  }

  loading = signal<boolean>(true);
  schoolId = signal(this.schoolsStore.info()?.id!);

  private getData() {
    this.loading.set(true);
    this.getAll();
  }

  private getAll() {
    this.services.getAllMappedData(this.schoolId()).subscribe((teachers) => {
      this.schoolTeacherListStore.fillInitial({
        teachers,
        canAddTeacher: true,
        canAddTeacherLesson: true,
        canApproveTeachers: true,
      });
      this.loading.set(false);
    });
  }

  onTeacherAssigned() {
    this.getData();
  }
}
