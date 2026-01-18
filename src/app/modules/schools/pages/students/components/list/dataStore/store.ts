import { SchoolsStudentsService } from '@/modules/schools/services';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractSharedSchoolStudentsManagementStore,
  IGetSchoolStudentsRequestPayload,
  INITIAL_SHARED_SCHOOL_STUDENTS_MANAGEMENT_STATE,
} from '../../../../../../../shared/components/modules/students';

@Injectable({ providedIn: 'any' })
export class SchoolStudentsManagementStore extends AbstractSharedSchoolStudentsManagementStore {
  private studentsServices = inject(SchoolsStudentsService);
  private activatedRoute = inject(ActivatedRoute);

  protected getAllService = (payload: IGetSchoolStudentsRequestPayload) =>
    this.studentsServices.getAll(payload);

  initialQueryParams = this.activatedRoute.snapshot.queryParams;
  services = {
    getAll: this.studentsServices.getAll,
  };
  initialData = INITIAL_SHARED_SCHOOL_STUDENTS_MANAGEMENT_STATE;

  constructor() {
    super();
    this.fillInitial(this.initialData);
    this.setInitialMainFilter();
  }
}
