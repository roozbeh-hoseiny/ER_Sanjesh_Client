import { ToastService } from '@/core/services/toast.service';
import { SchoolExamsService } from '@/modules/schools/services/exams.service';
import { IColumn } from '@/shared/components/pageDataList/page-data-list.component';
import { UikitEmptyStateComponent } from '@/uikit';
import { Component, computed, inject, Input, signal } from '@angular/core';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { catchError, finalize, throwError } from 'rxjs';
import { SchoolExamStore } from '../../dataStore';
import { ISchoolStudentWithExamsInfoResponse } from '../../models';
import { SchoolExamRegistrationDialogComponent } from './registration/registration-dialog.component';

@Component({
  selector: 'school_exam-students',
  templateUrl: './students.component.html',
  imports: [
    TableModule,
    Badge,
    UikitEmptyStateComponent,
    Button,
    SchoolExamRegistrationDialogComponent,
  ],
})
export class SchoolExamStudentsComponent {
  @Input() examId!: string;

  columns!: IColumn[];

  private service = inject(SchoolExamsService);
  private toastService = inject(ToastService);
  private store = inject(SchoolExamStore);

  students = signal<ISchoolStudentWithExamsInfoResponse[]>([]);
  loading = signal(true);

  visibleRegistration = signal(false);
  selectedStudents = signal<ISchoolStudentWithExamsInfoResponse[]>([]);

  selectedStudentsIds = computed(() => this.selectedStudents().map((s) => s.studentInfo.id));

  constructor() {}

  ngOnInit() {
    this.getStudents();
    this.setColumns();
  }

  getStudents(): void {
    this.loading.set(true);
    this.service
      .getStudents(this.examId)
      .pipe(
        catchError((error) => {
          this.students.set([]);
          this.toastService.error({
            text: 'خطا در دریافت اطلاعات دانش آموزان',
          });
          return throwError(error);
        }),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.students.set(res);
        },
      });
  }

  setColumns() {
    this.columns = [
      {
        field: 'studentInfo',
        header: 'نام دانش آموز',
        type: 'nested',
        nestedPath: 'firstName',
        customDataModel: (item) =>
          `${item.studentInfo.gender ? 'آقای ' : 'خانم '}${item.studentInfo.firstName} ${item.studentInfo.lastName}`,
      },
      { field: 'studentInfo', header: 'کد ملی', type: 'nested', nestedPath: 'nationalCode' },
      { field: 'studentInfo', header: 'شماره موبایل', type: 'nested', nestedPath: 'mobile' },
      {
        field: 'registeredInExam',
        header: ' در آزمون ثبت نام شده؟',
        type: 'boolean',
      },
    ];
  }

  registerSelectedStudents() {
    if (this.selectedStudents().length === 0) {
      this.toastService.warn({
        text: 'لطفا حداقل یک دانش آموز را انتخاب کنید.',
      });
      return;
    }

    this.visibleRegistration.set(true);
  }

  onRegistrationSuccess() {
    this.store.getInfo().subscribe();
    this.getStudents();
  }
}
