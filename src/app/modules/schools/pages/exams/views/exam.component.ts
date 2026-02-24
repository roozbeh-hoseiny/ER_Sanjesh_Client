import { Maybe } from '@/core';
import { BreadcrumbService } from '@/core/services';
import { ToastService } from '@/core/services/toast.service';
import { schoolsNamedRoutes } from '@/modules/schools/constants';
import { SchoolsStore } from '@/modules/schools/dataStore';
import { SchoolExamsService } from '@/modules/schools/services/exams.service';
import { AppCardComponent, KeyValueComponent } from '@/shared/components';
import { IColumn } from '@/shared/components/pageDataList/page-data-list.component';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { catchError, finalize, throwError } from 'rxjs';
import { SchoolExamStudentsComponent } from '../components';
import { ISchoolExamDetailsResponse } from '../models';

@Component({
  selector: 'school-exam',
  templateUrl: './exam.component.html',
  imports: [ProgressSpinner, AppCardComponent, KeyValueComponent, SchoolExamStudentsComponent],
})
export class SchoolExamComponent {
  columns!: IColumn[];

  private schoolsStore = inject(SchoolsStore);
  private examsService = inject(SchoolExamsService);
  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  schoolId = signal(this.schoolsStore.info()?.id!);
  initLoading = computed(() => this.schoolsStore.initLoading());
  examId = signal(this.route.snapshot.params['id']);
  exam = signal<Maybe<ISchoolExamDetailsResponse>>(null);
  loading = signal(true);

  constructor() {
    this.getExam();
  }

  getExam(): void {
    this.loading.set(true);
    console.log('examId');
    console.log(this.examId());

    this.examsService
      .get(this.examId())
      .pipe(
        catchError((error) => {
          this.exam.set(null);
          this.toastService.error({
            text: 'چنین آزمونی‌ای‌ای وجود ندارد یا ممکن است حذف شده باشد.',
          });
          this.router.navigate([schoolsNamedRoutes.exams.path]);
          return throwError(error);
        }),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.exam.set(res);
          this.setBreadcrumbs();
        },
      });
  }

  setBreadcrumbs(): void {
    this.breadcrumbService.setItems([
      schoolsNamedRoutes.root.meta,
      schoolsNamedRoutes.exams.meta,
      {
        title: this.exam()?.examTitle || '',
      },
    ]);
  }
}
