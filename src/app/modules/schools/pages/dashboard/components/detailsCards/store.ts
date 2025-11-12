import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import {
  IAttachCategoryToSchoolRequestPayload,
  ICategoryFullTreeMapped,
  ICategoryFullTreeResponse,
  IDetachCategoryToSchoolRequestPayload,
} from '@/modules/admin/pages/schools/models/schools';
import { AdminSchoolsService } from '@/modules/admin/services/admin-schools.service';
import {
  ISchoolAddressRequest,
  ISchoolContactRequest,
  ISchoolInfoRequest,
  ISchoolResponse,
} from '@/modules/schools/models';
import { SchoolsInfoService } from '@/modules/schools/services';
import { IFieldOfStudiesResponse } from '@/shared/catalog';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { SCHOOL_DETAILS_SERVICE, SchoolDetailsService } from './service.token';

interface ISchoolDetailsCardsState {
  school: Maybe<ISchoolResponse>;
  showManagerValidateInlineConfirmation?: boolean;
  showContactValidateInlineConfirmation?: boolean;
  showContactCard?: boolean;
  canEditInfo: boolean;
  canEditAddress: boolean;
  canEditContact: boolean;
  canEditLoginInfo: boolean;
  canEditCategories: boolean;
  canEditFields: boolean;
  submitContactLoading: boolean;
}

export const INITIAL_SCHOOL_DETAILS_CARDS_STATE: ISchoolDetailsCardsState = {
  school: null,
  showManagerValidateInlineConfirmation: false,
  showContactValidateInlineConfirmation: false,
  showContactCard: false,
  canEditInfo: false,
  canEditAddress: false,
  canEditContact: false,
  canEditLoginInfo: false,
  canEditCategories: false,
  canEditFields: false,
  submitContactLoading: false,
};

@Injectable({ providedIn: 'any' })
export class SchoolDetailsCardsStore {
  private state$ = signal<ISchoolDetailsCardsState>({ ...INITIAL_SCHOOL_DETAILS_CARDS_STATE });

  // selectors
  readonly school = computed(() => this.state$().school as Maybe<ISchoolResponse>);
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
  readonly canEditInfo = computed(() => !!this.state$().canEditInfo);
  readonly canEditAddress = computed(() => !!this.state$().canEditAddress);
  readonly canEditContact = computed(() => !!this.state$().canEditContact);
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

  // capture injected token first so we can tell if a custom implementation
  // was provided by a parent injector (component/module).
  private _injectedService = inject(SCHOOL_DETAILS_SERVICE, { optional: true });
  private _hasCustomService = !!this._injectedService;

  private service: Partial<SchoolDetailsService> = this._injectedService ?? {
    editInfo: (req: any) => this._defaultSchoolsInfo.editInfo(req) as Observable<any>,
    editAddress: (req: any) => this._defaultSchoolsInfo.editAddress(req) as Observable<any>,
    updateContact: (payload: any) =>
      this._defaultAdminSchools.updateContact(payload) as Observable<any>,
    validateContactEmail: (id: string) => of(true) as Observable<boolean>,
    validateContactMobile: (id: string) => of(true) as Observable<boolean>,
    validateManagerEmail: (id: string) => of(true) as Observable<boolean>,
    validateManagerMobile: (id: string) => of(true) as Observable<boolean>,
    invalidateContactEmail: (id: string) => of(true) as Observable<boolean>,
    invalidateContactMobile: (id: string) => of(true) as Observable<boolean>,
    invalidateManagerEmail: (id: string) => of(true) as Observable<boolean>,
    invalidateManagerMobile: (id: string) => of(true) as Observable<boolean>,

    attachCategory: (payload: IAttachCategoryToSchoolRequestPayload) =>
      of(true) as Observable<boolean>,
    detachCategory: (payload: IDetachCategoryToSchoolRequestPayload) =>
      of(true) as Observable<boolean>,
  };

  setService(svc: Partial<SchoolDetailsService>) {
    this.service = svc;
    this._hasCustomService = true;
  }

  editInfo(request: ISchoolInfoRequest) {
    if (this.service.editInfo) {
      this.setState({ submitContactLoading: true });
      return this.service.editInfo(request).pipe(
        tap((res) => {
          this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
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

  validateContactEmail(id: string) {
    if (this.service.validateContactEmail === undefined) return of();
    return this.service.validateContactEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  validateContactMobile(id: string) {
    if (this.service.validateContactMobile === undefined) return of();
    return this.service.validateContactMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }

  validateManagerMobile(id: string) {
    if (this.service.validateManagerMobile === undefined) return of();
    return this.service.validateManagerMobile(id)?.pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  validateManagerEmail(id: string) {
    if (this.service.validateManagerEmail === undefined) return of();
    return this.service.validateManagerEmail(id)?.pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }

  invalidateContactEmail(id: string) {
    if (this.service.invalidateContactEmail === undefined) return of();
    return this.service.invalidateContactEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  invalidateContactMobile(id: string) {
    if (this.service.invalidateContactMobile === undefined) return of();
    return this.service.invalidateContactMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }

  invalidateManagerEmail(id: string) {
    if (this.service.invalidateManagerEmail === undefined) return of();
    return this.service.invalidateManagerEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  invalidateManagerMobile(id: string) {
    if (this.service.invalidateManagerMobile === undefined) return of();
    return this.service.invalidateManagerMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
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
