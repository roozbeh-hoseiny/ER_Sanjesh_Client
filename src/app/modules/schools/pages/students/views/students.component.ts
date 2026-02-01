import { SchoolsStore } from '@/modules/schools/dataStore';
import { SchoolsStudentsService } from '@/modules/schools/services';
import { SharedSchoolStudentsComponent } from '@/modules/schools/shared/students/components/list/list.component';
import { Component, computed, inject, signal } from '@angular/core';
import { SchoolStudentsManagementStore } from '../components';

@Component({
  selector: 'school-students',
  templateUrl: './students.component.html',
  imports: [SharedSchoolStudentsComponent],
})
export class SchoolStudentsComponent {
  private schoolsStore = inject(SchoolsStore);
  private schoolStudentsManagementStore = inject(SchoolStudentsManagementStore);
  private studentsServices = inject(SchoolsStudentsService);

  schoolId = signal(this.schoolsStore.info()?.id!);
  initLoading = computed(() => this.schoolsStore.initLoading());

  constructor(private service: SchoolsStudentsService) {
    this.schoolStudentsManagementStore.getAllService = (payload) =>
      this.studentsServices.getAll(payload);

    this.schoolStudentsManagementStore.submitStudentService = (payload) =>
      this.studentsServices.create(payload);

    this.schoolStudentsManagementStore.unassignStudentService = (payload) =>
      this.studentsServices.unassign(payload);

    this.schoolStudentsManagementStore.setState({
      schoolId: this.schoolId(),
      canAddBulkStudents: true,
      canAddStudent: true,
    });
  }
}
