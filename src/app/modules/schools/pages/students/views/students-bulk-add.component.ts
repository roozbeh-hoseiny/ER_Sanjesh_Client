import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { SchoolsStudentsService } from '@/modules/schools/services';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { Component, signal } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { IStudentBulkAddResponse } from '../models';

@Component({
  selector: 'school-students-bulk-add',
  templateUrl: './students-bulk-add.component.html',
  imports: [
    Message,
    FileUpload,
    ProgressSpinner,
    AccordionModule,
    PageDataListComponent,
    TableModule,
  ],
})
export class SchoolStudentsBulkAddComponent {
  constructor(
    private service: SchoolsStudentsService,
    private toastService: ToastService,
  ) {}

  columns = [
    {
      field: 'firstName',
      header: 'نام',
      minWidth: '120px',
      width: '120px',
    },
    {
      field: 'lastName',
      header: 'نام خانوادگی',
      minWidth: '120px',
      width: '120px',
    },
    {
      field: 'genderTitle',
      header: 'جنسیت',
      minWidth: '120px',
      width: '120px',
    },
    {
      field: 'nationalId',
      header: 'کد ملی',
      minWidth: '120px',
      width: '120px',
    },
    {
      field: 'fatherName',
      header: 'نام پدر',
      minWidth: '120px',
      width: '120px',
    },
    {
      field: 'errorMessages',
      header: 'مشکلات در ثبت',
      minWidth: '250px',
    },
  ] as IColumn[];

  submitLoading = signal(false);
  uploadedResult = signal<Maybe<IStudentBulkAddResponse[]>>([]);
  hasErrorOnUploadedResult = signal(false);
  isUploaded = signal(false);

  onSelectedFile($event: FileSelectEvent) {
    const file = $event.files?.[0];
    if (!file) {
      return;
    }
    this.submitLoading.set(true);
    const payload = new FormData();
    payload.append('file', file, file.name);
    this.service.bulkAdd(payload).subscribe({
      next: (res) => {
        if (res.some((r) => r.hasError)) {
          this.hasErrorOnUploadedResult.set(true);
          this.toastService.error({ text: 'متاسفانه مشکلی در ثبت برخی دانش‌آموزان وجود دارد' });
        } else {
          this.toastService.success({ text: 'تمامی دانش‌اموزان با موفقیت ثبت شدند' });
          this.hasErrorOnUploadedResult.set(false);
        }
        this.uploadedResult.set(res);
        this.isUploaded.set(true);
        this.submitLoading.set(false);
      },
      error: () => {
        this.isUploaded.set(false);
        this.uploadedResult.set(null);
        this.submitLoading.set(false);
      },
    });
  }
}
