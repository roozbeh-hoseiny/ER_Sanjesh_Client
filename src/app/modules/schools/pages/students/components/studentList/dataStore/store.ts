import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGetSchoolStudentsRequestPayload, IStudentResponse } from '../../../models';
import { SCHOOL_STUDENT_LIST_SERVICE, SchoolStudentListService } from './service.token';

interface ISchoolStudentListState {
  students: Maybe<IStudentResponse[]>;
  schoolId: Maybe<string>;
  mainFilter: Partial<IGetSchoolStudentsRequestPayload>;
}

export const INITIAL_STUDENT_LIST_STATE: ISchoolStudentListState = {
  students: null,
  schoolId: null,
  mainFilter: {},
};

@Injectable({ providedIn: 'any' })
export class SchoolStudentListStore {
  constructor(
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
  ) {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    const mainFilter: Partial<IGetSchoolStudentsRequestPayload> = {
      academicYear: queryParams['academicYear'] ? Number(queryParams['academicYear']) : undefined,
      educationalLevelId: queryParams['educationalLevelId']
        ? Number(queryParams['educationalLevelId'])
        : undefined,
      fieldOfStudyId: queryParams['fieldOfStudyId']
        ? Number(queryParams['fieldOfStudyId'])
        : undefined,
    };
    this.setState({ mainFilter });
  }

  private state$ = signal<ISchoolStudentListState>({ ...INITIAL_STUDENT_LIST_STATE });

  readonly students = computed(() => this.state$().students);
  readonly schoolId = computed(() => this.state$().schoolId);
  readonly mainFilter = computed(() => this.state$().mainFilter);

  setState(partial: Partial<ISchoolStudentListState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  updateMainFilterState(partial: Partial<IGetSchoolStudentsRequestPayload>) {
    this.setState({
      mainFilter: { ...this.state$().mainFilter, ...partial },
    });
  }

  private _injectedService = inject(SCHOOL_STUDENT_LIST_SERVICE, { optional: true });
  private service: Partial<SchoolStudentListService> = this._injectedService ?? {};

  setService(svc: Partial<SchoolStudentListService>) {
    this.service = svc;
  }

  reset() {
    this.state$.set({ ...INITIAL_STUDENT_LIST_STATE });
  }

  // convenience: set full initial data
  fillInitial(data: Partial<ISchoolStudentListState>) {
    this.state$.set({ ...INITIAL_STUDENT_LIST_STATE, ...data });
  }

  addBulk(payload: FormData) {
    return this.service.addBulk?.(payload).subscribe();
  }
}
