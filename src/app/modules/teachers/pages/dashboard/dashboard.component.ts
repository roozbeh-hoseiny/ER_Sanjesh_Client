import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { TeachersStore } from '../../dataStore';
import { IApproveSchoolRequestPayload, IRejectSchoolRequestPayload } from '../../models';
import { TeachersInfoService } from '../../services';
import {
  TeacherDetailsComponent,
  TeacherValidateEmailDialogComponent,
  TeacherValidateMobileDialogComponent,
} from './components';
import { TeacherDetailsCardsStore } from './components/detailsCards/dataStore/store';

@Component({
  selector: 'app-teachers-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    CommonModule,
    TeacherDetailsComponent,
    TeacherValidateMobileDialogComponent,
    TeacherValidateEmailDialogComponent,
  ],
})
export class TeachersDashboardComponent {
  readonly isOpenConfirmationMobileModal = signal<boolean>(false);
  readonly isOpenConfirmationEmailModal = signal<boolean>(false);

  constructor(
    protected teacherStore: TeachersStore,
    protected layoutService: LayoutService,
    protected detailsStore: TeacherDetailsCardsStore,
    protected teacherService: TeachersInfoService,
  ) {
    this.layoutService.changeIsFixedContentSize(true);
    this.detailsStore.setService({
      approveSchool: (payload: IApproveSchoolRequestPayload) =>
        this.teacherService.approveSchool(payload),
      rejectSchool: (payload: IRejectSchoolRequestPayload) =>
        this.teacherService.rejectSchool(payload),
      validateMobile: (id: string) => this.openConfirmationMobileModal(id),
      validateEmail: (id: string) => this.openConfirmationEmailModal(id),
    });

    effect(() => {
      const info = this.teacherStore.info();
      if (info) {
        this.detailsStore.fillInitial({
          info,
          canApproveSchools: true,
        });
      }
    });
  }

  readonly info = computed(() => this.teacherStore.info());
  readonly teacherId = computed(() => this.teacherStore.info()?.id);

  readonly loading = computed(() => this.teacherStore.initLoading());

  ngOnDestroy() {
    this.layoutService.changeIsFixedContentSize(false);
    this.detailsStore.reset();
  }

  refreshData() {
    this.teacherStore.getInfo();
  }

  openConfirmationMobileModal(schoolId: string) {
    this.isOpenConfirmationMobileModal.set(true);
  }
  openConfirmationEmailModal(schoolId: string) {
    this.isOpenConfirmationEmailModal.set(true);
  }
}
