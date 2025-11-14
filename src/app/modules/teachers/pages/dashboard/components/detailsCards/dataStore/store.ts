import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import {
  IAttachLessonRequestPayload,
  ITeacherLesson,
  ITeacherMeResponse,
} from '@/modules/teachers/models';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TEACHER_DETAILS_SERVICE, TeacherDetailsService } from './service.token';

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

interface ITeacherDetailsCardsState {
  info: Maybe<ITeacherMeResponse>;
  showValidateInlineConfirmation?: boolean;
  canEditLoginInfo: boolean;
  canEditLessons: boolean;
  canEditSchools: boolean;
  canApproveSchools: boolean;
}

export const INITIAL_TEACHER_DETAILS_CARDS_STATE: ITeacherDetailsCardsState = {
  info: null,
  showValidateInlineConfirmation: false,
  canEditLoginInfo: false,
  canEditLessons: false,
  canEditSchools: false,
  canApproveSchools: false,
};

@Injectable({ providedIn: 'any' })
export class TeacherDetailsCardsStore {
  private state$ = signal<ITeacherDetailsCardsState>({ ...INITIAL_TEACHER_DETAILS_CARDS_STATE });

  // selectors
  readonly info = computed(() => this.state$().info);
  readonly showValidateInlineConfirmation = computed(() =>
    Boolean(this.state$().showValidateInlineConfirmation),
  );
  readonly canEditLoginInfo = computed(() => !!this.state$().canEditLoginInfo);
  readonly canEditCategories = computed(() => !!this.state$().canEditLessons);
  readonly canEditSchools = computed(() => !!this.state$().canEditSchools);
  readonly canApproveSchools = computed(() => !!this.state$().canApproveSchools);

  // simple mutators
  setState(partial: Partial<ITeacherDetailsCardsState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  private toastService = inject(ToastService);

  // capture injected token first so we can tell if a custom implementation
  // was provided by a parent injector (component/module).
  private _injectedService = inject(TEACHER_DETAILS_SERVICE, { optional: true });

  private service: Partial<TeacherDetailsService> = this._injectedService ?? {
    editLoginInfo: (req: any) => of(true) as Observable<any>,
    validateEmail: (id: string) => of(true) as Observable<boolean>,
    validateMobile: (id: string) => of(true) as Observable<boolean>,
    invalidateEmail: (id: string) => of(true) as Observable<boolean>,
    invalidateMobile: (id: string) => of(true) as Observable<boolean>,

    attachLesson: (payload: any) => of(true) as Observable<boolean>,
    detachLesson: (payload: any) => of(true) as Observable<boolean>,

    approveSchool: (payload: any) => of(true) as Observable<boolean>,
    rejectSchool: (payload: any) => of(true) as Observable<boolean>,
  };

  setService(svc: Partial<TeacherDetailsService>) {
    this.service = svc;
  }

  editLoginInfo(request: any) {
    if (this.service.editLoginInfo) {
      return this.service.editLoginInfo(request).pipe(
        tap((res) => {
          this.toastService.success({ text: 'اطلاعات ورود با موفقیت به‌روزرسانی شد.' });
        }),
      );
    }
    return of();
  }

  validateMobile(id: string) {
    if (this.service.validateMobile === undefined) return of();
    return this.service.validateMobile(id)?.pipe(
      tap(() => {
        this.toastService.success({ text: 'شماره‌ی تماس با موفقیت تایید شد.' });
      }),
    );
  }
  validateEmail(id: string) {
    if (this.service.validateEmail === undefined) return of();
    return this.service.validateEmail(id)?.pipe(
      tap(() => {
        this.toastService.success({ text: 'ایمیل با موفقیت تایید شد.' });
      }),
    );
  }

  invalidateEmail(id: string) {
    if (this.service.invalidateEmail === undefined) return of();
    return this.service.invalidateEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'شماره‌ی تماس با موفقیت رد شد.' });
      }),
    );
  }
  invalidateMobile(id: string) {
    if (this.service.invalidateMobile === undefined) return of();
    return this.service.invalidateMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'ایمیل با موفقیت رد شد.' });
      }),
    );
  }

  attachLesson(payload: IAttachLessonRequestPayload) {
    if (this.service.attachLesson === undefined) return of();
    return this.service.attachLesson(payload);
  }
  detachLesson(payload: ITeacherLesson) {
    console.log(payload);

    if (this.service.detachLesson === undefined) return of();
    return this.service
      .detachLesson({
        teacherId: this.info()?.id!,
        schoolId: payload.schoolId,
        lessonId: payload.lessonId,
      })
      .pipe(
        tap(() => {
          this.toastService.success({ text: `درس ${payload.lessonTitle} با موفقیت غیرفعال شد.` });
        }),
      );
  }

  changeSchoolStatus(payload: IChangeStatusSchoolPayload) {
    if (payload.isActive) {
      return this.approveSchool(payload);
    }
    return this.rejectSchool(payload);
  }

  approveSchool(payload: IChangeStatusSchoolPayload) {
    if (this.service.approveSchool === undefined) return of();
    return this.service
      .approveSchool({ teacherId: this.info()!.id, schoolId: payload.schoolId })
      .pipe(
        tap(() => {
          this.toastService.success({
            text: `تمامی دروس مربوط به مدرسه ${payload.schoolTitle} با موفقیت فعال شد.`,
          });
        }),
      );
  }
  rejectSchool(payload: IChangeStatusSchoolPayload) {
    if (this.service.rejectSchool === undefined) return of();
    return this.service
      .rejectSchool({ teacherId: this.info()!.id, schoolId: payload.schoolId })
      .pipe(
        tap(() => {
          this.toastService.success({
            text: `تمامی دروس مربوط به مدرسه ${payload.schoolTitle} با موفقیت غیرفعال شد.`,
          });
        }),
      );
  }

  changeSchoolLessonStatus(payload: IChangeStatusSchoolLessonPayload) {
    if (payload.isActive) {
      return this.approveSchoolLesson(payload);
    }
    return this.rejectSchoolLesson(payload);
  }

  approveSchoolLesson(payload: IChangeStatusSchoolLessonPayload) {
    if (this.service.approveSchoolLesson === undefined) return of();
    return this.service
      .approveSchoolLesson({ teacherId: this.info()!.id, teacherLessonId: payload.teacherLessonId })
      .pipe(
        tap(() => {
          this.toastService.success({
            text: `درس ${payload.teacherLessonTitle} از مدرسه ${payload.schoolTitle} با موفقیت فعال شد.`,
          });
        }),
      );
  }
  rejectSchoolLesson(payload: IChangeStatusSchoolLessonPayload) {
    if (this.service.rejectSchoolLesson === undefined) return of();
    return this.service
      .rejectSchoolLesson({ teacherId: this.info()!.id, teacherLessonId: payload.teacherLessonId })
      .pipe(
        tap(() => {
          this.toastService.success({
            text: `درس ${payload.teacherLessonTitle} از مدرسه ${payload.schoolTitle} با موفقیت غیرفعال شد.`,
          });
        }),
      );
  }

  attachSchool(payload: ITeacherLesson) {
    if (this.service.attachLesson === undefined) return of();
    return this.service.attachLesson({ ...payload, id: this.info()!.id }).pipe(
      tap(() => {
        this.toastService.success({
          text: `درس ${payload.lessonTitle} از مدرسه ${payload.schoolTitle} با موفقیت ایجاد شد.`,
        });
      }),
    );
  }
  detachSchool(payload: ITeacherLesson) {
    if (this.service.detachSchool === undefined) return of();
    return this.service
      .detachSchool({
        teacherId: this.info()?.id!,
        schoolId: payload.schoolId,
      })
      .pipe(
        tap(() => {
          this.toastService.success({
            text: `اتصال به مدرسه ${payload.schoolTitle} با موفقیت حذف شد.`,
          });
        }),
      );
  }

  reset() {
    this.state$.set({ ...INITIAL_TEACHER_DETAILS_CARDS_STATE });
  }

  // convenience: set full initial data
  fillInitial(data: Partial<ITeacherDetailsCardsState>) {
    this.state$.set({ ...INITIAL_TEACHER_DETAILS_CARDS_STATE, ...data });
  }
}
