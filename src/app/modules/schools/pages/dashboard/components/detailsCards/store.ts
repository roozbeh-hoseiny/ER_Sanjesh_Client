import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import {
  IAttachAgentToSchoolRequestPayload,
  ICategoryFullTreeMapped,
  ICategoryFullTreeResponse,
} from '@/modules/admin/pages/schools/models/schools';
import { AdminSchoolsService } from '@/modules/admin/services/admin-schools.service';
import {
  ISchoolAddressRequest,
  ISchoolBankInfoAddRequestPayload,
  ISchoolBankInfoEditRequestPayload,
  ISchoolBankInfoRemoveRequestPayload,
  ISchoolContactRequest,
  ISchoolInfoRequest,
  ISchoolResponse,
} from '@/modules/schools/models';
import { SchoolsInfoService } from '@/modules/schools/services';
import { IFieldOfStudiesResponse } from '@/shared/catalog';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ISchoolTeacherMappedData, ISchoolTeacherRawResponse } from '../../../teachers/models';
import { SCHOOL_DETAILS_SERVICE, SchoolDetailsService } from './service.token';

interface ISchoolDetailsCardsState {
  school: Maybe<ISchoolResponse>;
  showTeachersCard?: boolean;
  showBankAccountsCard?: boolean;
  showAgentCard?: boolean;
  teachers: Maybe<ISchoolTeacherRawResponse[]>;
  teachersManagementPageRoute?: Maybe<(schoolId: string) => string>;
  showManagerValidateInlineConfirmation?: boolean;
  showContactValidateInlineConfirmation?: boolean;
  showContactCard?: boolean;
  canEditInfo: boolean;
  canEditEditStatus: boolean;
  canEditBankAccounts: boolean;
  canEditAddress: boolean;
  canEditContact: boolean;
  canEditAgent: boolean;
  canEditLoginInfo: boolean;
  canEditCategories: boolean;
  canEditFields: boolean;
  submitContactLoading: boolean;
}

export const INITIAL_SCHOOL_DETAILS_CARDS_STATE: ISchoolDetailsCardsState = {
  school: null,
  showTeachersCard: false,
  showBankAccountsCard: false,
  showAgentCard: false,
  teachers: null,
  teachersManagementPageRoute: null,
  showManagerValidateInlineConfirmation: false,
  showContactValidateInlineConfirmation: false,
  showContactCard: false,
  canEditInfo: false,
  canEditEditStatus: false,
  canEditBankAccounts: false,
  canEditAddress: false,
  canEditContact: false,
  canEditAgent: false,
  canEditLoginInfo: false,
  canEditCategories: false,
  canEditFields: false,
  submitContactLoading: false,
};

@Injectable({ providedIn: 'any' })
export class SchoolDetailsCardsStore {
  constructor() {
    effect(() => {
      if (this.state$().showTeachersCard && this.getTeachers !== undefined) {
        if (this.state$().teachers === null && this.school()?.uniqueId) {
          this.getTeachers()!.subscribe((teachers) => {
            this.setState({ teachers });
          });
        }
      }
    });
  }

  private state$ = signal<ISchoolDetailsCardsState>({ ...INITIAL_SCHOOL_DETAILS_CARDS_STATE });

  // selectors
  readonly school = computed(() => this.state$().school as Maybe<ISchoolResponse>);
  readonly showTeachersCard = computed(() => this.state$().showTeachersCard);
  readonly showBankAccountsCard = computed(() => this.state$().showBankAccountsCard);
  readonly teachers = computed(() => {
    if (this.state$().teachers) {
      return [...(this.state$().teachers || [])].map((teacher) => ({
        ...teacher,
        fullname: `${teacher.gender ? 'آقای' : 'خانم'} ${teacher.firstName} ${teacher.lastName}`,
      })) as ISchoolTeacherMappedData[];
    }
    return [];
  });
  readonly teachersManagementPageRoute = computed(() => {
    if (this.school() && this.state$().teachersManagementPageRoute) {
      return this.state$().teachersManagementPageRoute!(this.school()!.uniqueId);
    }
    return null;
  });
  readonly schoolCategories = computed(
    () => (this.state$().school?.categories || []) as ICategoryFullTreeResponse[],
  );
  readonly showManagerValidateInlineConfirmation = computed(() =>
    Boolean(this.state$().showManagerValidateInlineConfirmation),
  );
  readonly showContactValidateInlineConfirmation = computed(() =>
    Boolean(this.state$().showContactValidateInlineConfirmation),
  );
  readonly showContactCard = computed(() => Boolean(this.state$().showContactCard));
  readonly showAgentCard = computed(() => Boolean(this.state$().showAgentCard));
  readonly canEditInfo = computed(() => !!this.state$().canEditInfo);
  readonly canEditEditStatus = computed(() => !!this.state$().canEditEditStatus);
  readonly canEditBankAccounts = computed(() => !!this.state$().canEditBankAccounts);
  readonly canEditAddress = computed(() => !!this.state$().canEditAddress);
  readonly canEditContact = computed(() => !!this.state$().canEditContact);
  readonly canEditAgent = computed(() => !!this.state$().canEditAgent);
  readonly canEditLoginInfo = computed(() => !!this.state$().canEditLoginInfo);
  readonly canEditCategories = computed(() => !!this.state$().canEditCategories);
  readonly canEditFields = computed(() => !!this.state$().canEditFields);
  readonly submitContactLoading = computed(() => !!this.state$().submitContactLoading);

  // simple mutators
  setState(partial: Partial<ISchoolDetailsCardsState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  private toastService = inject(ToastService);
  private _defaultSchoolsInfo = inject(SchoolsInfoService);
  private _defaultAdminSchools = inject(AdminSchoolsService);

  private _injectedService = inject(SCHOOL_DETAILS_SERVICE, { optional: true });

  private service: Partial<SchoolDetailsService> = this._injectedService ?? {};

  setService(svc: Partial<SchoolDetailsService>) {
    this.service = svc;
  }

  getTeachers() {
    return this.service.getTeachers!(this.school()!.uniqueId, this.school()!.id);
  }

  searchForAgent(uniqueId: string) {
    return this.service.searchForAgent!(uniqueId);
  }

  editInfo(request: ISchoolInfoRequest) {
    if (this.service.editInfo) {
      this.setState({ submitContactLoading: true });
      return this.service.editInfo(request).pipe(
        tap((res) => {
          this.toastService.success({ text: 'اطلاعات مرکز آموزشی با موفقیت به‌روزرسانی شد.' });
        }),
        finalize(() => this.setState({ submitContactLoading: false })),
      );
    }
    return of();
  }

  editAddress(request: ISchoolAddressRequest) {
    if (this.service.editAddress) {
      this.setState({ submitContactLoading: true });
      return this.service.editAddress(request).pipe(
        tap(() => {
          this.toastService.success({ text: 'آدرس با موفقیت به‌روزرسانی شد.' });
          // const cur = this.state$();
          // if (cur.school) {
          //   const updated = {
          //     ...cur.school,
          //     address: { ...cur.school.address, ...request },
          //   } as ISchoolResponse;
          //   this.setState({ school: updated });

          // }
        }),
        finalize(() => this.setState({ submitContactLoading: false })),
      );
    }
    return of();
  }

  editContact(payload: ISchoolContactRequest) {
    if (this.service.updateContact) {
      this.setState({ submitContactLoading: true });
      return this.service.updateContact(payload).pipe(
        tap((ok) => {
          if (ok) {
            this.toastService.success({ text: 'اطلاعات تماس با موفقیت به‌روزرسانی شد.' });
            //   const cur = this.state$();
            // if (cur.school) {
            //   const updated = {
            //     ...cur.school,
            //     contactInfo: {
            //       ...(cur.school.contactInfo || {}),
            //       firstName: payload.firstname,
            //       lastName: payload.lastname,
            //       gender: payload.gender,
            //       email: payload.email,
            //       mobile: payload.mobile,
            //     },
            //   } as ISchoolResponse;
            //   this.setState({ school: updated });
            // }
          }
        }),
        finalize(() => this.setState({ submitContactLoading: false })),
      );
    }
    return of();
  }

  addBankInfo(payload: ISchoolBankInfoAddRequestPayload) {
    if (this.service.addBankInfo === undefined) return of();
    return this.service.addBankInfo(payload).pipe(
      tap(() => {
        this.toastService.success({ text: 'حساب بانکی جدید با موفقیت ایجاد شد' });
      }),
    );
  }
  editBankInfo(payload: ISchoolBankInfoEditRequestPayload) {
    if (this.service.editBankInfo === undefined) return of();
    return this.service.editBankInfo(payload).pipe(
      tap(() => {
        this.toastService.success({ text: 'حساب بانکی با موفقیت ویرایش شد' });
      }),
    );
  }
  removeBankInfo(payload: ISchoolBankInfoRemoveRequestPayload) {
    if (this.service.removeBankInfo === undefined) return of();
    return this.service.removeBankInfo(payload).pipe(
      tap(() => {
        this.toastService.success({ text: 'حساب بانکی با موفقیت حذف شد' });
      }),
    );
  }

  validateContactEmail(id: string) {
    if (this.service.validateContactEmail === undefined) return of();
    return this.service.validateContactEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مرکز آموزشی با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  validateContactMobile(id: string) {
    if (this.service.validateContactMobile === undefined) return of();
    return this.service.validateContactMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مرکز آموزشی با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }

  validateManagerMobile(id: string) {
    if (this.service.validateManagerMobile === undefined) return of();
    return this.service.validateManagerMobile(id)?.pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مرکز آموزشی با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  validateManagerEmail(id: string) {
    if (this.service.validateManagerEmail === undefined) return of();
    return this.service.validateManagerEmail(id)?.pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مرکز آموزشی با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }

  invalidateContactEmail(id: string) {
    if (this.service.invalidateContactEmail === undefined) return of();
    return this.service.invalidateContactEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مرکز آموزشی با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  invalidateContactMobile(id: string) {
    if (this.service.invalidateContactMobile === undefined) return of();
    return this.service.invalidateContactMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مرکز آموزشی با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }

  invalidateManagerEmail(id: string) {
    if (this.service.invalidateManagerEmail === undefined) return of();
    return this.service.invalidateManagerEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مرکز آموزشی با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  invalidateManagerMobile(id: string) {
    if (this.service.invalidateManagerMobile === undefined) return of();
    return this.service.invalidateManagerMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مرکز آموزشی با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }

  updateCanEditInfo(schoolId: string, status: boolean) {
    if (status) {
      if (this.service.enableCanEdit === undefined) return of();
      return this.service.enableCanEdit(schoolId).pipe(
        tap(() => {
          this.toastService.success({ text: 'امکان ویرایش با موفقیت فعال شد.' });
        }),
      );
    } else {
      if (this.service.disableCanEdit === undefined) return of();
      return this.service.disableCanEdit(schoolId).pipe(
        tap(() => {
          this.toastService.success({ text: 'امکان ویرایش با موفقیت غیر فعال شد.' });
        }),
      );
    }
  }

  updateCanPurchaseByCredit(schoolId: string, status: boolean) {
    if (status) {
      if (this.service.enableCanPurchaseByCredit === undefined) return of();
      return this.service.enableCanPurchaseByCredit(schoolId).pipe(
        tap(() => {
          this.toastService.success({ text: 'امکان خرید اعتباری با موفقیت فعال شد.' });
        }),
      );
    } else {
      if (this.service.disableCanPurchaseByCredit === undefined) return of();
      return this.service.disableCanPurchaseByCredit(schoolId).pipe(
        tap(() => {
          this.toastService.success({ text: 'امکان خرید اعتباری با موفقیت غیر فعال شد.' });
        }),
      );
    }
  }

  attachAgent(payload: IAttachAgentToSchoolRequestPayload) {
    if (this.service.attachAgent === undefined) return of();
    return this.service.attachAgent({ id: this.school()!.id, agentId: payload.agentId }).pipe(
      tap(() => {
        this.toastService.success({ text: `کارگزار با موفقیت اضافه شد.` });
      }),
    );
  }
  detachAgent(agentId: number) {
    if (this.service.detachAgent === undefined) return of();
    return this.service.detachAgent({ id: this.school()!.id, agentId }).pipe(
      tap(() => {
        this.toastService.success({ text: 'کارگزار با موفقیت حذف شد.' });
      }),
    );
  }

  attachCategory(payload: ICategoryFullTreeMapped) {
    if (this.service.attachCategory === undefined) return of();
    return this.service.attachCategory({ id: this.school()!.id, categoryId: payload.id }).pipe(
      tap(() => {
        this.toastService.success({ text: `دسته‌بندی ${payload.label} با موفقیت اضافه شد.` });
      }),
    );
  }
  detachCategory(categoryId: number) {
    if (this.service.detachCategory === undefined) return of();
    return this.service.detachCategory({ id: this.school()!.id, categoryId }).pipe(
      tap(() => {
        this.toastService.success({ text: 'دسته‌بندی با موفقیت حذف شد.' });
      }),
    );
  }

  attachLesson(payload: ICategoryFullTreeMapped) {
    if (this.service.attachCategory === undefined) return of();
    return this.service.attachCategory({ id: this.school()!.id, categoryId: payload.id }).pipe(
      tap(() => {
        this.toastService.success({ text: `دسته‌بندی ${payload.label} با موفقیت اضافه شد.` });
      }),
    );
  }
  detachLesson(categoryId: number) {
    if (this.service.detachCategory === undefined) return of();
    return this.service.detachCategory({ id: this.school()!.id, categoryId }).pipe(
      tap(() => {
        this.toastService.success({ text: 'دسته‌بندی با موفقیت حذف شد.' });
      }),
    );
  }

  attachField(payload: IFieldOfStudiesResponse) {
    if (this.service.attachField === undefined) return of();
    return this.service.attachField({ id: this.school()!.id, fieldOfStudyId: payload.id }).pipe(
      tap(() => {
        this.toastService.success({
          text: `رشته ${payload.title} با موفقیت اضافه شد.`,
        });
      }),
    );
  }
  detachField(fieldOfStudyId: number) {
    if (this.service.detachField === undefined) return of();
    return this.service.detachField({ id: this.school()!.id, fieldOfStudyId }).pipe(
      tap(() => {
        this.toastService.success({ text: 'رشته با موفقیت حذف شد.' });
      }),
    );
  }

  reset() {
    this.state$.set({ ...INITIAL_SCHOOL_DETAILS_CARDS_STATE });
  }

  // convenience: set full initial data
  fillInitial(data: Partial<ISchoolDetailsCardsState>) {
    this.state$.set({ ...INITIAL_SCHOOL_DETAILS_CARDS_STATE, ...data });
  }
}
