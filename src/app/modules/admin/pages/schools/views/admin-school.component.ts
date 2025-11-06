import { BreadcrumbService } from '@/core/services';
import { ToastService } from '@/core/services/toast.service';
import { LayoutService } from '@/layout/service/layout.service';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { AdminSchoolsService } from '@/modules/admin/services';
import { ISchoolContactRequest } from '@/modules/schools/models';
import { SchoolDetailsComponent } from '@/modules/schools/pages/dashboard/components/detailsCards/school-details.component';
import { SCHOOL_DETAILS_SERVICE } from '@/modules/schools/pages/dashboard/components/detailsCards/service.token';
import { SchoolDetailsCardsStore } from '@/modules/schools/pages/dashboard/components/detailsCards/store';
import { SchoolsInfoService } from '@/modules/schools/services';
import { Component, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { IAdminSchoolResponse } from '../models/schools';

@Component({
  selector: 'app-admin-school',
  templateUrl: './admin-school.component.html',
  imports: [SchoolDetailsComponent, ProgressSpinner],
  providers: [
    {
      provide: SCHOOL_DETAILS_SERVICE,
      useFactory: (schoolService: SchoolsInfoService, adminSchoolService: AdminSchoolsService) => ({
        editInfo: (req: any) => schoolService.editInfo(req),
        editAddress: (req: any) => schoolService.editAddress(req),
        editContactInfo: (req: any) => adminSchoolService.updateContact(req),
      }),
      deps: [SchoolsInfoService, AdminSchoolsService],
    },
  ],
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
  ) {
    this.layoutService.changeIsFixedContentSize(true);
    effect(() => {
      const info = this.school();
      if (info) {
        this.schoolDetailsStore.fillInitial({
          school: info,
          canEditAddress: true,
          canEditInfo: true,
          canEditLoginInfo: true,
          canEditContact: true,
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
        this.toastService.success({ text: 'اطلاعات رابط مدرسه با موفقیت به‌روزرسانی شد.' });
        this.loadSchool();
      },
      error: (err) => {
        this.submitContactLoading.set(false);
      },
    });
  }
}
