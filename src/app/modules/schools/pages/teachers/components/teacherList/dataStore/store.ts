import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { IAttachLessonRequestPayload, ITeacherLesson } from '@/modules/teachers/models';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ISchoolTeacherMappedData } from '../../../models';
import { SCHOOL_TEACHER_LIST_SERVICE, SchoolTeacherListService } from './service.token';

export interface IChangeStatusSchoolPayload {
  schoolId: string;
  schoolTitle: string;
  isActive?: boolean;
}

export interface IChangeStatusSchoolLessonPayload {
  teacherLessonTitle: string;
  teacherLessonId: number;
  schoolTitle: string;
  isActive?: boolean;
}

interface ISchoolTeacherListState {
  teachers: Maybe<ISchoolTeacherMappedData[]>;
  showValidateInlineConfirmation?: boolean;
  canApproveTeachers: boolean;
  canAddTeacher: boolean;
  canAddTeacherLesson: boolean;
}

export const INITIAL_TEACHER_DETAILS_CARDS_STATE: ISchoolTeacherListState = {
  teachers: null,
  showValidateInlineConfirmation: false,
  canApproveTeachers: false,
  canAddTeacher: false,
  canAddTeacherLesson: false,
};

@Injectable({ providedIn: 'any' })
export class SchoolTeacherListStore {
  constructor(private toastService: ToastService) {}

  private state$ = signal<ISchoolTeacherListState>({ ...INITIAL_TEACHER_DETAILS_CARDS_STATE });

  readonly teachers = computed(() => this.state$().teachers);
  readonly showValidateInlineConfirmation = computed(() =>
    Boolean(this.state$().showValidateInlineConfirmation),
  );
  readonly canApproveTeachers = computed(() => !!this.state$().canApproveTeachers);
  readonly canAddTeacher = computed(() => !!this.state$().canAddTeacher);
  readonly canAddTeacherLesson = computed(() => !!this.state$().canAddTeacherLesson);

  setState(partial: Partial<ISchoolTeacherListState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  private _injectedService = inject(SCHOOL_TEACHER_LIST_SERVICE, { optional: true });

  private service: Partial<SchoolTeacherListService> = this._injectedService ?? {
    attachLesson: (payload: any) => of(true) as Observable<boolean>,
    detachLesson: (payload: any) => of(true) as Observable<boolean>,

    approveTeacher: (payload: any) => of(true) as Observable<boolean>,
    rejectTeacher: (payload: any) => of(true) as Observable<boolean>,
  };

  setService(svc: Partial<SchoolTeacherListService>) {
    this.service = svc;
  }

  attachLesson(payload: IAttachLessonRequestPayload) {
    if (this.service.attachLesson === undefined) return of();
    return this.service.attachLesson(payload);
  }
  detachLesson(payload: ITeacherLesson) {
    if (this.service.detachLesson === undefined) return of();
    return of();
    // return this.service
    //   .detachLesson({
    //     teacherId: this.info()?.id!,
    //     schoolId: payload.schoolId,
    //     lessonId: payload.lessonId,
    //   })
    //   .pipe(
    //     tap(() => {
    //       this.toastService.success({ text: `درس ${payload.lessonTitle} با موفقیت غیرفعال شد.` });
    //     }),
    //   );
  }

  changeTeacherStatus(payload: IChangeStatusSchoolPayload) {
    if (payload.isActive) {
      return this.approveTeacher(payload);
    }
    return this.rejectTeacher(payload);
  }

  approveTeacher(payload: IChangeStatusSchoolPayload) {
    if (this.service.approveTeacher === undefined) return of();
    return of();
    // return this.service
    //   .approveTeacher({ teacherId: this.info()!.id, schoolId: payload.schoolId })
    //   .pipe(
    //     tap(() => {
    //       this.toastService.success({
    //         text: `تمامی دروس مربوط به مرکز آموزشی ${payload.schoolTitle} با موفقیت فعال شد.`,
    //       });
    //     }),
    //   );
  }
  rejectTeacher(payload: IChangeStatusSchoolPayload) {
    if (this.service.rejectTeacher === undefined) return of();
    return of();
    // return this.service
    //   .rejectTeacher({ teacherId: this.info()!.id, schoolId: payload.schoolId })
    //   .pipe(
    //     tap(() => {
    //       this.toastService.success({
    //         text: `تمامی دروس مربوط به مرکز آموزشی ${payload.schoolTitle} با موفقیت غیرفعال شد.`,
    //       });
    //     }),
    //   );
  }

  changeTeacherLessonStatus(payload: IChangeStatusSchoolLessonPayload) {
    if (payload.isActive) {
      return this.approveTeacherLesson(payload);
    }
    return this.rejectTeacherLesson(payload);
  }

  approveTeacherLesson(payload: IChangeStatusSchoolLessonPayload) {
    if (this.service.approveTeacherLesson === undefined) return of();
    return of();
    // return this.service
    //   .approveTeacherLesson({
    //     teacherId: this.info()!.id,
    //     teacherLessonId: payload.teacherLessonId,
    //   })
    //   .pipe(
    //     tap(() => {
    //       this.toastService.success({
    //         text: `درس ${payload.teacherLessonTitle} از مرکز آموزشی ${payload.schoolTitle} با موفقیت فعال شد.`,
    //       });
    //     }),
    //   );
  }
  rejectTeacherLesson(payload: IChangeStatusSchoolLessonPayload) {
    if (this.service.rejectTeacherLesson === undefined) return of();
    return of();
    // return this.service
    //   .rejectTeacherLesson({ teacherId: this.info()!.id, teacherLessonId: payload.teacherLessonId })
    //   .pipe(
    //     tap(() => {
    //       this.toastService.success({
    //         text: `درس ${payload.teacherLessonTitle} از مرکز آموزشی ${payload.schoolTitle} با موفقیت غیرفعال شد.`,
    //       });
    //     }),
    //   );
  }

  attachTeacher(payload: ITeacherLesson) {
    if (this.service.attachLesson === undefined) return of();
    return of();
    // return this.service.attachLesson({ ...payload, id: this.info()!.id }).pipe(
    //   tap(() => {
    //     this.toastService.success({
    //       text: `درس ${payload.lessonTitle} از مرکز آموزشی ${payload.schoolTitle} با موفقیت ایجاد شد.`,
    //     });
    //   }),
    // );
  }
  detachTeacher(payload: ITeacherLesson) {
    if (this.service.detachTeacher === undefined) return of();
    return of();
    // return this.service
    //   .detachTeacher({
    //     teacherId: this.info()?.id!,
    //     schoolId: payload.schoolId,
    //   })
    //   .pipe(
    //     tap(() => {
    //       this.toastService.success({
    //         text: `الصاق به مرکز آموزشی ${payload.schoolTitle} با موفقیت حذف شد.`,
    //       });
    //     }),
    //   );
  }

  reset() {
    this.state$.set({ ...INITIAL_TEACHER_DETAILS_CARDS_STATE });
  }

  // convenience: set full initial data
  fillInitial(data: Partial<ISchoolTeacherListState>) {
    this.state$.set({ ...INITIAL_TEACHER_DETAILS_CARDS_STATE, ...data });
  }
}
