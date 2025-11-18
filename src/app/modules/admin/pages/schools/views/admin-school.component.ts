import { BreadcrumbService } from '@/core/services';
import { ToastService } from '@/core/services/toast.service';
import { LayoutService } from '@/layout/service/layout.service';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { adminSchoolNamedRoutes } from '@/modules/admin/constants/routes';
import { AdminSchoolsService } from '@/modules/admin/services';
import { ISchoolContactRequest, ISchoolInfoRequest } from '@/modules/schools/models';
import { SchoolDetailsComponent } from '@/modules/schools/pages/dashboard/components/detailsCards/school-details.component';
import { SchoolDetailsCardsStore } from '@/modules/schools/pages/dashboard/components/detailsCards/store';
import { SchoolsInfoService } from '@/modules/schools/services';
import { Component, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import {
  IAdminSchoolResponse,
  IAttachCategoryToSchoolRequestPayload,
  IAttachFieldToSchoolRequestPayload,
  IDetachCategoryToSchoolRequestPayload,
  IDetachFieldToSchoolRequestPayload,
} from '../models/schools';

@Component({
  selector: 'app-admin-school',
  templateUrl: './admin-school.component.html',
  imports: [SchoolDetailsComponent, ProgressSpinner],
})
export class AdminSchoolComponent {
  schoolId = signal<string>('');
  initLoading = signal<boolean>(true);
  school = signal<IAdminSchoolResponse>({} as IAdminSchoolResponse);
  submitContactLoading = signal<boolean>(false);

  constructor(
    private schoolService: AdminSchoolsService,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private breadcrumbService: BreadcrumbService,
    private schoolDetailsStore: SchoolDetailsCardsStore,
    private schoolsInfoService: SchoolsInfoService,
  ) {
    this.layoutService.changeIsFixedContentSize(true);

    this.schoolDetailsStore.setService({
      getTeachers: (schoolUniqueId: string, schoolId: string) =>
        this.schoolsInfoService.getTeachers(schoolId),
      editInfo: (req: ISchoolInfoRequest) => this.schoolService.updateInfo(req),
      editAddress: (req: any) => this.schoolService.updateAddress(req),
      updateContact: (req: any) => this.schoolService.updateContact(req),
      addBankInfo: (payload) => this.schoolService.addBankInfo(payload),
      editBankInfo: (payload) => this.schoolService.editBankInfo(payload),
      removeBankInfo: (payload) => this.schoolService.removeBankInfo(payload),
      attachCategory: (payload: IAttachCategoryToSchoolRequestPayload) =>
        this.schoolService.attachCategory(payload),
      detachCategory: (payload: IDetachCategoryToSchoolRequestPayload) =>
        this.schoolService.detachCategory(payload),
      attachField: (payload: IAttachFieldToSchoolRequestPayload) =>
        this.schoolService.attachField(payload),
      detachField: (payload: IDetachFieldToSchoolRequestPayload) =>
        this.schoolService.detachField(payload),
      validateContactEmail: (id: string) => this.schoolService.validateContactEmail(id),
      validateContactMobile: (id: string) => this.schoolService.validateContactMobile(id),
      validateManagerEmail: (id: string) => this.schoolService.validateManagerEmail(id),
      validateManagerMobile: (id: string) => this.schoolService.validateManagerMobile(id),
      invalidateContactEmail: (id: string) => this.schoolService.invalidateContactEmail(id),
      invalidateContactMobile: (id: string) => this.schoolService.invalidateContactMobile(id),
      invalidateManagerEmail: (id: string) => this.schoolService.invalidateManagerEmail(id),
      invalidateManagerMobile: (id: string) => this.schoolService.invalidateManagerMobile(id),
    });
    effect(() => {
      const info = this.school();
      if (info) {
        this.schoolDetailsStore.fillInitial({
          school: info,
          showContactCard: true,
          canEditAddress: true,
          canEditInfo: true,
          canEditLoginInfo: true,
          showBankAccountsCard: true,
          canEditBankAccounts: true,
          canEditContact: true,
          canEditCategories: true,
          showContactValidateInlineConfirmation: true,
          showManagerValidateInlineConfirmation: true,
          showTeachersCard: true,
          teachersManagementPageRoute: () =>
            adminSchoolNamedRoutes.schoolTeachers.meta.pagePath!(this.schoolId()),
        });
      }
    });
    this.schoolId.set(this.route.snapshot.paramMap.get('schoolId') || '');
  }

  ngOnInit() {
    this.loadSchool();
  }

  ngOnDestroy() {
    this.layoutService.changeIsFixedContentSize(false);
  }

  setBreadcrumb() {
    this.breadcrumbService.setItems([
      adminNamedRoutes.root.meta,
      adminNamedRoutes.schools.meta,
      {
        title: this.school().name,
      },
    ]);
  }

  loadSchool() {
    return this.schoolService.getOne(this.schoolId()).subscribe((school) => {
      this.school.set(school);
      this.setBreadcrumb();
      this.initLoading.set(false);
    });
  }

  onSubmitContact(payload: ISchoolContactRequest) {
    this.schoolService.updateContact({ ...payload, id: this.schoolId() }).subscribe({
      next: (value) => {
        this.submitContactLoading.set(false);
        this.toastService.success({ text: 'اطلاعات رابط مرکز آموزشی با موفقیت به‌روزرسانی شد.' });
        this.loadSchool();
      },
      error: (err) => {
        this.submitContactLoading.set(false);
      },
    });
  }
}
