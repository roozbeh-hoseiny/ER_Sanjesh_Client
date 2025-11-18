import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { schoolsTeachersNamedRoutes } from '../../constants/routes';
import { SchoolsStore } from '../../dataStore';
import { SchoolsInfoService } from '../../services';
import { SchoolsTeachersService } from '../../services/schools-teachers.service';
import { SchoolDetailsComponent, ValidateManagerMobileDialogComponent } from './components';
import { SchoolDetailsCardsStore } from './components/detailsCards/store';
import { ValidateManagerEmailDialogComponent } from './components/validateDialog/validate-manager-email-dialog.component';

@Component({
  selector: 'app-schools-dashboard',
  templateUrl: './schools-dashboard.component.html',
  imports: [
    CommonModule,
    SchoolDetailsComponent,
    ValidateManagerMobileDialogComponent,
    ValidateManagerEmailDialogComponent,
  ],
})
export class SchoolsDashboardComponent {
  readonly isOpenConfirmationMobileModal = signal<boolean>(false);
  readonly isOpenConfirmationEmailModal = signal<boolean>(false);

  constructor(
    protected schoolStore: SchoolsStore = inject(SchoolsStore),
    protected layoutService: LayoutService = inject(LayoutService),
    protected detailsStore: SchoolDetailsCardsStore = inject(SchoolDetailsCardsStore),
    protected schoolService: SchoolsInfoService,
    protected teachersService: SchoolsTeachersService,
  ) {
    this.layoutService.changeIsFixedContentSize(true);
    this.detailsStore.setService({
      getTeachers: (schoolUniqueId: string) => this.teachersService.getAll(schoolUniqueId),
      editInfo: (req: any) => this.schoolService.editInfo(req),
      editAddress: (req: any) => this.schoolService.editAddress(req),
      addBankInfo: (payload) => this.schoolService.addBankInfo(payload),
      editBankInfo: (payload) => this.schoolService.editBankInfo(payload),
      removeBankInfo: (payload) => this.schoolService.removeBankInfo(payload),
      validateManagerMobile: (id: string) => this.openConfirmationMobileModal(id),
      validateManagerEmail: (id: string) => this.openConfirmationEmailModal(id),
    });

    effect(() => {
      const info = this.schoolStore.info();
      if (info) {
        this.detailsStore.fillInitial({
          school: info,
          showTeachersCard: true,
          teachersManagementPageRoute: () =>
            schoolsTeachersNamedRoutes.teachers.meta.pagePath!(this.schoolStore.info()?.id),
          showContactCard: true,
          showBankAccountsCard: true,
          canEditAddress: true,
          canEditBankAccounts: true,
          canEditInfo: true,
          canEditLoginInfo: true,
        });
      }
    });
  }

  readonly info = computed(() => this.schoolStore.info());
  readonly schoolId = computed(() => this.schoolStore.info()?.id);

  readonly loading = computed(() => this.schoolStore.initLoading());

  ngOnDestroy() {
    this.layoutService.changeIsFixedContentSize(false);
    this.detailsStore.reset();
  }

  refreshData() {
    this.schoolStore.getInfo();
    this.teachersService.getAll(this.info()?.uniqueId!);
    this.detailsStore.setState({});
  }

  openConfirmationMobileModal(schoolId: string) {
    this.isOpenConfirmationMobileModal.set(true);
  }
  openConfirmationEmailModal(schoolId: string) {
    this.isOpenConfirmationEmailModal.set(true);
  }
}
