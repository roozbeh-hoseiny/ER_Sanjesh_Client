import { SCHOOLS_API_ROUTES } from '@/modules/schools/constants';
import { SchoolsStudentsService } from '@/modules/schools/services';
import {
  CheckAndCreateStudentStepsComponent,
  IAssignExistStudentToSchoolRequestPayload,
  ICheckExistStudentRequestPayload,
  IStudentRequestPayload,
} from '@/shared/components/modules';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-single-student-form-dialog',
  templateUrl: './add-single-student-form-dialog.component.html',
  imports: [CheckAndCreateStudentStepsComponent],
  providers: [SchoolsStudentsService],
})
export class AddSingleStudentFormDialogComponent {
  @Output() onAdd = new EventEmitter<any>();
  @Output() onClose = new EventEmitter();

  constructor(public service: SchoolsStudentsService) {}

  successfullyAdd(student: any) {
    this.onAdd.emit(student);
  }

  checkExistService(payload: ICheckExistStudentRequestPayload) {
    return this.service.checkIsExist(payload);
  }
  subService(payload: ICheckExistStudentRequestPayload) {
    return this.service.checkIsExist(payload).subscribe();
  }
  signupService(payload: IStudentRequestPayload) {
    return this.service.create(payload);
  }
  assignService(payload: IAssignExistStudentToSchoolRequestPayload) {
    this.service.assign(payload);
  }

  assignServiceApiRoute = SCHOOLS_API_ROUTES.students.assign();
  signupServiceApiRoute = SCHOOLS_API_ROUTES.students.create();
  checkExistServiceApiRoute = SCHOOLS_API_ROUTES.students.checkExist();

  close() {
    this.onClose.emit();
  }
}
