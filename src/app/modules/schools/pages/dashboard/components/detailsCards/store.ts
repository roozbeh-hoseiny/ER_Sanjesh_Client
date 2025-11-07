import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { AdminSchoolsService } from '@/modules/admin/services/admin-schools.service';
import {
  ISchoolAddressRequest,
  ISchoolContactRequest,
  ISchoolInfoRequest,
  ISchoolResponse,
} from '@/modules/schools/models';
import { SchoolsInfoService } from '@/modules/schools/services';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { SCHOOL_DETAILS_SERVICE, SchoolDetailsService } from './service.token';

interface ISchoolDetailsCardsState {
  school: Maybe<ISchoolResponse>;
  canEditInfo: boolean;
  canEditAddress: boolean;
  canEditContact: boolean;
  canEditLoginInfo: boolean;
  submitContactLoading: boolean;
}

export const INITIAL_SCHOOL_DETAILS_CARDS_STATE: ISchoolDetailsCardsState = {
  school: null,
  canEditInfo: false,
  canEditAddress: false,
  canEditContact: false,
  canEditLoginInfo: false,
  submitContactLoading: false,
};

@Injectable({ providedIn: 'any' })
export class SchoolDetailsCardsStore {
  private state$ = signal<ISchoolDetailsCardsState>({ ...INITIAL_SCHOOL_DETAILS_CARDS_STATE });

  // selectors
  readonly school = computed(() => this.state$().school as Maybe<ISchoolResponse>);
  readonly canEditInfo = computed(() => !!this.state$().canEditInfo);
  readonly canEditAddress = computed(() => !!this.state$().canEditAddress);
  readonly canEditContact = computed(() => !!this.state$().canEditContact);
  readonly canEditLoginInfo = computed(() => !!this.state$().canEditLoginInfo);
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

  private service: SchoolDetailsService = this._injectedService ?? {
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
  };

  setService(svc: SchoolDetailsService) {
    this.service = svc;
    this._hasCustomService = true;
  }

  editInfo(request: ISchoolInfoRequest) {
    this.setState({ submitContactLoading: true });
    return this.service.editInfo(request).pipe(
      tap((res) => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
      finalize(() => this.setState({ submitContactLoading: false })),
    );
  }

  editAddress(request: ISchoolAddressRequest) {
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

  editContact(payload: ISchoolContactRequest) {
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

  validateContactEmail(id: string) {
    return this.service.validateContactEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  validateContactMobile(id: string) {
    console.log(this.service.validateContactMobile);
    return this.service.validateContactMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }

  validateManagerMobile(id: string) {
    return this.service.validateManagerMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  validateManagerEmail(id: string) {
    return this.service.validateManagerEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }

  invalidateContactEmail(id: string) {
    return this.service.invalidateContactEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  invalidateContactMobile(id: string) {
    return this.service.invalidateContactMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }

  invalidateManagerEmail(id: string) {
    return this.service.invalidateManagerEmail(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
      }),
    );
  }
  invalidateManagerMobile(id: string) {
    return this.service.invalidateManagerMobile(id).pipe(
      tap(() => {
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
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
