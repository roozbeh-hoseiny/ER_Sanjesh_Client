import { ToastService } from '@/core/services/toast.service';
import { SchoolExamsService } from '@/modules/schools/services/exams.service';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { Component, inject, Input, signal } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { ISchoolStudentWithExamsInfoResponse } from '../../models';

@Component({
  selector: 'school_exam-students',
  templateUrl: './students.component.html',
  imports: [PageDataListComponent],
})
export class SchoolExamStudentsComponent {
  @Input() examId!: string;
  columns!: IColumn[];

  private service = inject(SchoolExamsService);
  private toastService = inject(ToastService);

  students = signal<ISchoolStudentWithExamsInfoResponse[]>([]);
  loading = signal(true);

  constructor() {}

  ngOnInit() {
    this.getStudents();
    this.setColumns();
  }

  getStudents(): void {
    console.log(this.examId);
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
    ];
  }
}
