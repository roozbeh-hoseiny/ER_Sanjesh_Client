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
import { Observable } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
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

  private service: SchoolDetailsService = inject(SCHOOL_DETAILS_SERVICE, { optional: true }) ?? {
    editInfo: (req: any) => this._defaultSchoolsInfo.editInfo(req) as Observable<any>,
    editAddress: (req: any) => this._defaultSchoolsInfo.editAddress(req) as Observable<any>,
    updateContact: (payload: any) =>
      this._defaultAdminSchools.updateContact(payload) as Observable<any>,
  };

  editInfo(request: ISchoolInfoRequest) {
    this.setState({ submitContactLoading: true });
    return this.service.editInfo(request).pipe(
      tap((res) => {
        // this.setState({ school: res });
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

  reset() {
    this.state$.set({ ...INITIAL_SCHOOL_DETAILS_CARDS_STATE });
  }

  // convenience: set full initial data
  fillInitial(data: Partial<ISchoolDetailsCardsState>) {
    this.state$.set({ ...INITIAL_SCHOOL_DETAILS_CARDS_STATE, ...data });
  }
}
