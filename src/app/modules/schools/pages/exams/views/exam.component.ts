import { BreadcrumbService } from '@/core/services';
import { schoolsNamedRoutes } from '@/modules/schools/constants';
import { SchoolsStore } from '@/modules/schools/dataStore';
import { AppCardComponent, KeyValueComponent } from '@/shared/components';
import { IColumn } from '@/shared/components/pageDataList/page-data-list.component';
import { PriceMaskDirective } from '@/shared/directives';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Divider } from 'primeng/divider';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Tooltip } from 'primeng/tooltip';
import { SchoolExamStudentsComponent } from '../components';
import { SchoolExamStore } from '../dataStore';

@Component({
  selector: 'school-exam',
  templateUrl: './exam.component.html',
  imports: [
    ProgressSpinner,
    AppCardComponent,
    KeyValueComponent,
    SchoolExamStudentsComponent,
    Divider,
    PriceMaskDirective,
    Tooltip,
  ],
})
export class SchoolExamComponent {
  columns!: IColumn[];

  private schoolsStore = inject(SchoolsStore);
  private breadcrumbService = inject(BreadcrumbService);
  private route = inject(ActivatedRoute);
  private store = inject(SchoolExamStore);

  schoolId = signal(this.schoolsStore.info()?.id!);
  initLoading = computed(() => this.schoolsStore.initLoading());
  examId = signal(this.route.snapshot.params['id']);
  exam = computed(() => this.store.info());
  loading = computed(() => this.store.initLoading());

  breadcrumbItems = computed(() => [
    schoolsNamedRoutes.root.meta,
    schoolsNamedRoutes.exams.meta,
    {
      title: this.exam()?.examTitle || '',
    },
  ]);

  constructor() {
    this.store.examId = this.examId();
    this.store.getInfo().subscribe({
      next: (res) => {
        this.setBreadcrumbs();
      },
    });
    // this.setBreadcrumbs();
  }

  setBreadcrumbs(): void {
    this.breadcrumbService.setItems(this.breadcrumbItems());
  }
}
