import { Maybe } from '@/core';
import { IPaginatedMetaResponse } from '@/core/models/service.model';
import { ToastService } from '@/core/services/toast.service';
import { computed, signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { finalize, Observable, of } from 'rxjs';
import {
  IGetSchoolStudentsRequestPayload,
  IStudentRawResponse,
  IStudentRequestPayload,
  IStudentResponse,
  IUnassignExistStudentToSchoolRequestPayload,
  IUnassignExistStudentToSchoolRequestResponse,
} from '../../models';

export interface ISharedSchoolStudentsManagementState {
  getStudentsLoading: boolean;
  students: Maybe<IStudentResponse[]>;
  studentsPaginationMeta: IPaginatedMetaResponse;
  schoolId: Maybe<string>;
  mainFilter: Partial<IGetSchoolStudentsRequestPayload>;
  unassignLoading: boolean;
  canAddStudent: boolean;
  canAddBulkStudents: boolean;
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
    unassignLoading: false,
    canAddStudent: false,
    canAddBulkStudents: false,
  };

export abstract class AbstractSharedSchoolStudentsManagementStore {
  initialQueryParams: Params;
  initialData =
    INITIAL_SHARED_SCHOOL_STUDENTS_MANAGEMENT_STATE as ISharedSchoolStudentsManagementState;

  constructor(
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.fillInitial(this.initialData);
    this.initialQueryParams = this.activatedRoute.snapshot.queryParams;
  }

  private state$ = signal<ISharedSchoolStudentsManagementState>(
    INITIAL_SHARED_SCHOOL_STUDENTS_MANAGEMENT_STATE,
  );

  readonly students = computed(() => this.state$().students);
  readonly getStudentsLoading = computed(() => this.state$().getStudentsLoading);
  readonly schoolId = computed(() => this.state$().schoolId);
  readonly mainFilter = computed(() => this.state$().mainFilter);
  readonly unassignLoading = computed(() => this.state$().unassignLoading);
  readonly canAddStudent = computed(() => this.state$().canAddStudent);
  readonly canAddBulkStudents = computed(() => this.state$().canAddBulkStudents);

  getAllService(
    payload: IGetSchoolStudentsRequestPayload,
  ): Observable<Maybe<IStudentRawResponse[]>> {
    this.toastService.notAccessLocal();
    return of(null);
  }

  submitStudentService(payload: IStudentRequestPayload): Observable<Maybe<IStudentResponse>> {
    this.toastService.notAccessLocal();
    return of(null);
  }

  onSubmitMainFilter(queryParams: IGetSchoolStudentsRequestPayload) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });

    this.updateMainFilterState(queryParams);
    this.getAll();
  }

  unassignStudentService(
    payload: IUnassignExistStudentToSchoolRequestPayload,
  ): Observable<Maybe<IUnassignExistStudentToSchoolRequestResponse>> {
    this.toastService.notAccessLocal();
    return of(null);
  }

  doUnassignStudent(item: IStudentResponse) {
    this.setState({ unassignLoading: true });
    return this.unassignStudentService({ studentId: item.id })
      ?.pipe(
        finalize(() => {
          this.setState({ unassignLoading: false });
        }),
      )
      .subscribe((res) => {
        if (res) {
          this.toastService.success({
            text: `لغو عضویت دانش‌آموز ${item.firstName} ${item.lastName} با موفقیت انجام شد`,
          });
          this.refreshData();
        }
      });
  }

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
        onlyInSchool: this.initialQueryParams['onlyInSchool']
          ? this.initialQueryParams['onlyInSchool'] === 'true'
          : false,
      };
      this.updateMainFilterState(mainFilter);
    }
  }

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
    this.getAllService(filter as IGetSchoolStudentsRequestPayload)?.subscribe((students) => {
      this.setState({ getStudentsLoading: false, students: students || [] });
    });
  }

  refreshData() {
    this.getAll();
  }
}
