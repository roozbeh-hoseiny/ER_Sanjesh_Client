import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { SchoolsStore } from '../../dataStore';
import { SchoolsInfoService } from '../../services';
import { SchoolDetailsComponent } from './components';
import { SCHOOL_DETAILS_SERVICE } from './components/detailsCards/service.token';
import { SchoolDetailsCardsStore } from './components/detailsCards/store';

@Component({
  selector: 'app-schools-dashboard',
  templateUrl: './schools-dashboard.component.html',
  imports: [CommonModule, SchoolDetailsComponent],
  providers: [
    {
      provide: SCHOOL_DETAILS_SERVICE,
      useFactory: (schoolService: SchoolsInfoService) => ({
        editInfo: (req: any) => schoolService.editInfo(req),
        editAddress: (req: any) => schoolService.editAddress(req),
      }),
      deps: [SchoolsInfoService],
    },
  ],
})
export class SchoolsDashboardComponent {
  constructor(
    protected schoolStore: SchoolsStore = inject(SchoolsStore),
    protected layoutService: LayoutService = inject(LayoutService),
    protected detailsStore: SchoolDetailsCardsStore = inject(SchoolDetailsCardsStore),
  ) {
    this.layoutService.changeIsFixedContentSize(true);
    effect(() => {
      const info = this.schoolStore.info();
      if (info) {
        this.detailsStore.fillInitial({
          school: info,
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
}
