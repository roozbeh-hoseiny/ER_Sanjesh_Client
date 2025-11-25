import { BreadcrumbService } from '@/core/services';
import { schoolsNamedRoutes } from '@/modules/schools/constants';
import { SchoolsStore } from '@/modules/schools/dataStore';
import { SchoolsTeachersLessonsService } from '@/modules/schools/services';
import { SchoolsTeachersService } from '@/modules/schools/services/schools-teachers.service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { map } from 'rxjs';
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
    private teachersLessonsService: SchoolsTeachersLessonsService,
    private breadcrumbService: BreadcrumbService,
    private schoolTeacherListStore: SchoolTeacherListStore,
  ) {
    this.breadcrumbService.setItems([
      { ...schoolsNamedRoutes.root.meta },
      schoolsNamedRoutes.teachers.meta,
    ]);
    schoolTeacherListStore.setService({
      getTeacher: (payload) =>
        this.services.findByUniqueId(payload).pipe(
          map((res) => ({
            ...res,
            fullname: `${res.gender ? 'آقای' : 'خانم'} ${res.firstName} ${res.lastName}`,
          })),
        ),

      approveTeacher: (payload) => this.teachersLessonsService.approveAllLessons(payload.teacherId),
      rejectTeacher: (payload) => this.teachersLessonsService.rejectAllLessons(payload.teacherId),

      approveTeacherLesson: (payload) =>
        this.teachersLessonsService.approveLesson(payload.teacherId, payload.teacherLessonId),
      rejectTeacherLesson: (payload) =>
        this.teachersLessonsService.rejectLesson(payload.teacherId, payload.teacherLessonId),

      attachLesson: (payload) =>
        this.teachersLessonsService.assignTeacher(payload.id, payload.lessonId),
      // detachLesson: (payload) =>
      //   this.teachersLessonsService.removeTeacher(payload.teacherId, payload.lessonId),

      detachTeacher: (payload) => this.teachersLessonsService.removeTeacher(payload.teacherId),
    });
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

  refreshData() {
    this.getAll();
  }

  onTeacherAssigned() {
    this.getData();
  }
}
