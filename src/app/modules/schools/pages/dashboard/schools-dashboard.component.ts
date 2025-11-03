import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { SchoolsStore } from '../../dataStore';
import { SchoolDetailsComponent } from './components/school-details.component';

@Component({
  selector: 'app-schools-dashboard',
  templateUrl: './schools-dashboard.component.html',
  imports: [CommonModule, SchoolDetailsComponent],
})
export class SchoolsDashboardComponent {
  constructor(
    protected schoolStore: SchoolsStore = inject(SchoolsStore),
    protected layoutService: LayoutService = inject(LayoutService),
  ) {
    this.layoutService.changeIsFixedContentSize(true);
  }

  readonly info = computed(() => this.schoolStore.info());
  readonly schoolId = computed(() => this.schoolStore.info()?.id);

  readonly loading = computed(() => this.schoolStore.initLoading());

  ngOnDestroy() {
    this.layoutService.changeIsFixedContentSize(false);
  }

  refreshData() {
    this.schoolStore.getInfo();
  }
}
