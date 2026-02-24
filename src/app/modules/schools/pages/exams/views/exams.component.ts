import { BreadcrumbService } from '@/core/services';
import { schoolsNamedRoutes } from '@/modules/schools/constants';
import { SchoolsStore } from '@/modules/schools/dataStore';
import { SchoolExamsService } from '@/modules/schools/services/exams.service';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { catchError, finalize, throwError } from 'rxjs';
import { ISchoolExamsResponse } from '../models';

@Component({
  selector: 'school-exams',
  templateUrl: './exams.component.html',
  imports: [ProgressSpinner, PageDataListComponent],
})
export class SchoolExamsComponent {
  columns!: IColumn[];
  @ViewChild('registrationDateTime', { static: true }) registrationDateTimeTpl!: TemplateRef<any>;

  private schoolsStore = inject(SchoolsStore);
  private examsService = inject(SchoolExamsService);
  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);

  schoolId = signal(this.schoolsStore.info()?.id!);
  initLoading = computed(() => this.schoolsStore.initLoading());
  exams = signal<ISchoolExamsResponse[]>([]);
  loading = signal(true);

  constructor() {
    this.getExams();
  }
  ngOnInit() {
    this.setColumns();
  }

  getExams(): void {
    this.loading.set(true);
    this.examsService
      .getList()
      .pipe(
        catchError((error) => {
          this.exams.set([]);
          this.router.navigate([schoolsNamedRoutes.root.path]);
          return throwError(error);
        }),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.exams.set(res);
          this.setBreadcrumbs();
        },
      });
  }

  setBreadcrumbs(): void {
    this.breadcrumbService.setItems([
      schoolsNamedRoutes.root.meta,
      {
        title: schoolsNamedRoutes.exams.meta.title,
      },
    ]);
  }

  setColumns() {
    this.columns = [
      {
        field: 'title',
        header: 'عنوان آزمون',
      },
      { field: 'price', header: 'هزینه', type: 'price' },
      { field: 'duration', header: 'مدت زمان', type: 'duration' },
      { field: 'statusTitle', header: 'وضعیت' },
      {
        field: 'registrationStartTime',
        header: 'شروع ثبت نام',
        type: 'dateTime',
      },
      {
        field: 'registrationEndTime',
        header: 'پایان ثبت نام',
        type: 'dateTime',
      },
      // {
      //   field: ''
      // }
    ];
  }

  toDetails(item: ISchoolExamsResponse) {
    const detailRoute = schoolsNamedRoutes.exam.meta.pagePath!(item.id)! as string;
    this.router.navigateByUrl(detailRoute);
  }
}
