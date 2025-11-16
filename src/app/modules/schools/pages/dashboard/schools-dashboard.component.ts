import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { SchoolsStore } from '../../dataStore';
import { SchoolsInfoService } from '../../services';
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
  ) {
    this.layoutService.changeIsFixedContentSize(true);
    this.detailsStore.setService({
      editInfo: (req: any) => this.schoolService.editInfo(req),
      editAddress: (req: any) => this.schoolService.editAddress(req),
      validateManagerMobile: (id: string) => this.openConfirmationMobileModal(id),
      validateManagerEmail: (id: string) => this.openConfirmationEmailModal(id),
    });

    effect(() => {
      const info = this.schoolStore.info();
      if (info) {
        this.detailsStore.fillInitial({
          school: info,
          showContactCard: true,
          canEditAddress: true,
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
  }

  openConfirmationMobileModal(schoolId: string) {
    this.isOpenConfirmationMobileModal.set(true);
  }
  openConfirmationEmailModal(schoolId: string) {
    this.isOpenConfirmationEmailModal.set(true);
  }
}
