import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { computed, inject, Injectable, signal } from '@angular/core';
import { IStudentResponse } from '../../../models';
import { SCHOOL_STUDENT_LIST_SERVICE, SchoolStudentListService } from './service.token';

interface ISchoolStudentListState {
  students: Maybe<IStudentResponse[]>;
  schoolId: Maybe<string>;
}

export const INITIAL_STUDENT_LIST_STATE: ISchoolStudentListState = {
  students: null,
  schoolId: null,
};

@Injectable({ providedIn: 'any' })
export class SchoolStudentListStore {
  constructor(private toastService: ToastService) {}

  private state$ = signal<ISchoolStudentListState>({ ...INITIAL_STUDENT_LIST_STATE });

  readonly students = computed(() => this.state$().students);
  readonly schoolId = computed(() => this.state$().schoolId);

  setState(partial: Partial<ISchoolStudentListState>) {
    this.state$.set({ ...this.state$(), ...partial });
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
}
