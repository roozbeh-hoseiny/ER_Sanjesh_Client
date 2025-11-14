import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { AdminTeachersService } from '@/modules/admin/services';
import { IDetachLessonRequestPayload } from '@/modules/teachers/models';
import { computed, inject, Injectable, signal } from '@angular/core';
import { IAdminTeacherEntity, IAttachLessonToTeacherRequest } from '../../models';

interface ITeacherDetailsCardsState {
  teacher: Maybe<IAdminTeacherEntity>;
  canEditInfo: boolean;
  canEditLessons: boolean;
  submitInfoLoading: boolean;
}

export const INITIAL_TEACHER_DETAILS_CARDS_STATE: ITeacherDetailsCardsState = {
  teacher: null,
  canEditInfo: false,
  canEditLessons: false,
  submitInfoLoading: false,
};

@Injectable({ providedIn: 'root' })
export class TeacherDetailsCardsStore {
  private state$ = signal<ITeacherDetailsCardsState>({ ...INITIAL_TEACHER_DETAILS_CARDS_STATE });

  // selectors
  readonly teacher = computed(() => this.state$().teacher as Maybe<IAdminTeacherEntity>);
  readonly canEditInfo = computed(() => !!this.state$().canEditInfo);
  readonly canEditAddress = computed(() => !!this.state$().canEditLessons);

  setState(partial: Partial<ITeacherDetailsCardsState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  private toastService = inject(ToastService);
  private adminTeachersService = inject(AdminTeachersService);

  // editInfo(request: ITeacher) {
  //   // this.setState({ submitInfoLoading: true });
  //   // return this.adminTeachersService.editInfo(request).pipe(
  //   //   tap((res) => {
  //   //     // this.setState({ school: res });
  //   //     this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
  //   //   }),
  //   //   finalize(() => this.setState({ submitContactLoading: false })),
  //   // );
  // }

  attachLesson(request: IAttachLessonToTeacherRequest) {
    return this.adminTeachersService.attachLesson(request);
  }

  detachLesson(request: IDetachLessonRequestPayload) {
    return this.adminTeachersService.detachLesson(request);
  }

  reset() {
    this.state$.set({ ...INITIAL_TEACHER_DETAILS_CARDS_STATE });
  }

  // convenience: set full initial data
  fillInitial(data: Partial<ITeacherDetailsCardsState>) {
    this.state$.set({ ...INITIAL_TEACHER_DETAILS_CARDS_STATE, ...data });
  }
}
