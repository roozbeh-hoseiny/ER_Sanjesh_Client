import { Maybe } from '@/core';
import { IPaginatedMetaResponse } from '@/core/models/service.model';
import { computed, signal } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import {
  IGetSchoolStudentsRequestPayload,
  IStudentRawResponse,
  IStudentResponse,
} from '../../models';

export interface ISharedSchoolStudentsManagementState {
  getStudentsLoading: boolean;
  students: Maybe<IStudentResponse[]>;
  studentsPaginationMeta: IPaginatedMetaResponse;
  schoolId: Maybe<string>;
  mainFilter: Partial<IGetSchoolStudentsRequestPayload>;
}

export const INITIAL_SHARED_SCHOOL_STUDENTS_MANAGEMENT_STATE: ISharedSchoolStudentsManagementState =
  {
    getStudentsLoading: false,
    students: null,
    studentsPaginationMeta: {
      lastSeen: '',
      totalCount: 0,
    },
    schoolId: null,
    mainFilter: {},
  };

export abstract class AbstractSharedSchoolStudentsManagementStore {
  abstract initialQueryParams: Params;
  abstract initialData: ISharedSchoolStudentsManagementState;

  protected abstract getAllService: (
    payload: IGetSchoolStudentsRequestPayload,
  ) => Observable<IStudentRawResponse[]>;
  // protected abstract bulkAddService?: (payload: FormData) => Observable<IStudentBulkAddResponse[]>;
  // protected abstract addService?: (
  //   payload: IStudentRequestPayload,
  // ) => Observable<IStudentRequestResponse>;

  private state$ = signal<ISharedSchoolStudentsManagementState>(
    INITIAL_SHARED_SCHOOL_STUDENTS_MANAGEMENT_STATE,
  );

  constructor() {}

  setInitialMainFilter() {
    if (this.initialQueryParams) {
      let mainFilter = this.initialData.mainFilter;
      mainFilter = {
        academicYear: this.initialQueryParams['academicYear']
          ? Number(this.initialQueryParams['academicYear'])
          : undefined,
        educationalLevelId: this.initialQueryParams['educationalLevelId']
          ? Number(this.initialQueryParams['educationalLevelId'])
          : undefined,
        fieldOfStudyId: this.initialQueryParams['fieldOfStudyId']
          ? Number(this.initialQueryParams['fieldOfStudyId'])
          : undefined,
      };
      this.updateMainFilterState(mainFilter);
    }
  }

  readonly students = computed(() => this.state$().students);
  readonly getStudentsLoading = computed(() => this.state$().getStudentsLoading);
  readonly schoolId = computed(() => this.state$().schoolId);
  readonly mainFilter = computed(() => this.state$().mainFilter);

  setState(partial: Partial<ISharedSchoolStudentsManagementState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  updateMainFilterState(partial: Partial<IGetSchoolStudentsRequestPayload>) {
    this.setState({
      mainFilter: { ...this.state$().mainFilter, ...partial },
    });
  }

  reset() {
    this.state$.set({ ...this.initialData });
  }

  // convenience: set full initial data
  fillInitial(data: Partial<ISharedSchoolStudentsManagementState>) {
    this.state$.set({ ...INITIAL_SHARED_SCHOOL_STUDENTS_MANAGEMENT_STATE, ...data });
  }

  // addBulk(payload: FormData) {
  //   return this.bulkAddService?.(payload).subscribe();
  // }

  // createStudent(payload: IStudentRequestPayload) {
  //   return this.addService?.(payload).subscribe({
  //     next: () => {
  //       this.toastService.success({
  //         text: 'دانش‌آموز با موفقیت ایجاد شد',
  //       });
  //       this.getAll();
  //     },
  //   });
  // }

  getAll() {
    const filter = this.mainFilter();
    if (
      filter.academicYear === undefined ||
      filter.educationalLevelId === undefined ||
      filter.fieldOfStudyId === undefined
    ) {
      return;
    }
    this.setState({ getStudentsLoading: true, students: [] });
    this.getAllService?.(filter as IGetSchoolStudentsRequestPayload).subscribe((students) => {
      this.setState({ getStudentsLoading: false, students: students || [] });
    });
  }
}
