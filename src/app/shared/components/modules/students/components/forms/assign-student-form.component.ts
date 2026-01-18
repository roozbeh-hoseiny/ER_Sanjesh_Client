import { ToastService } from '@/core/services/toast.service';
import { AbstractFormDialog } from '@/shared/abstractClasses';
import { AcademicYearsSelectComponent, FieldsSelectComponent } from '@/shared/catalog';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { finalize } from 'rxjs';
import {
  IAssignExistStudentToSchoolRequestPayload,
  IAssignExistStudentToSchoolRequestResponse,
} from '../../models';

@Component({
  selector: 'app-assign-student-form',
  templateUrl: './assign-student-form.component.html',
  imports: [
    Dialog,
    FormFooterActionsComponent,
    AcademicYearsSelectComponent,
    ReactiveFormsModule,
    FieldsSelectComponent,
  ],
})
export class AssignStudentFormComponent extends AbstractFormDialog<
  IAssignExistStudentToSchoolRequestPayload,
  IAssignExistStudentToSchoolRequestResponse
> {
  declare initialValues?: {
    studentId: string;
  };
  // @Input() submitService!: (
  //   payload: IAssignExistStudentToSchoolRequestPayload,
  // ) => Subscribable<IAssignExistStudentToSchoolRequestResponse>;
  @Input() submitServiceAPIRoute!: string;

  constructor(
    private readonly http: HttpClient,
    private toast: ToastService,
  ) {
    super();
  }

  ngOnChanges() {
    if (this.initialValues) {
      this.form.patchValue(this.initialValues);
    }
  }

  form = this.fb.group({
    studentId: this.fb.control(this.initialValues?.studentId || '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    academicYear: this.fb.control(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fieldOfStudyId: this.fb.control(null, { nonNullable: true, validators: [Validators.required] }),
  });

  override submit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.submitLoading.set(true);
      console.log(this.submitForm);

      // @ts-ignore
      this.submitForm(this.form.value!)
        .pipe(
          finalize(() => {
            this.submitLoading.set(false);
            this.form.enable();
          }),
        )
        .subscribe((res) => {
          this.form.reset();
          this.toast.success({ text: 'عملیات با موفقیت انجام شد.' });
          this.onSubmit.emit(res);
        });
    }
  }

  submitForm(payload: IAssignExistStudentToSchoolRequestPayload) {
    return this.http.post(this.submitServiceAPIRoute, payload);
  }
}
