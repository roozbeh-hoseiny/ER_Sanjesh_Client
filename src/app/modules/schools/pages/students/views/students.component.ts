import { SchoolsStore } from '@/modules/schools/dataStore';
import { SchoolsStudentsService } from '@/modules/schools/services';
import { Component, Inject, signal } from '@angular/core';
import { SchoolStudentListStore } from '../components';

@Component({
  selector: 'school-students',
  templateUrl: './students.component.html',
})
export class SchoolStudentsComponent {
  private schoolsStore = Inject(SchoolsStore);
  loading = signal<boolean>(true);
  schoolId = signal(this.schoolsStore.info()?.id!);

  constructor(
    private services: SchoolsStudentsService,
    private schoolStudentListStore: SchoolStudentListStore,
  ) {}

  private getData() {
    this.loading.set(true);
    this.getAll();
  }

  private getAll() {
    this.services.getAll(this.schoolId()).subscribe((students) => {
      this.schoolStudentListStore.fillInitial({
        students,
        schoolId: this.schoolId(),
      });
      this.loading.set(false);
    });
  }

  refreshData() {
    this.getAll();
  }
}
