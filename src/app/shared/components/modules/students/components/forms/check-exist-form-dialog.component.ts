import { AbstractFormDialog } from '@/shared/abstractClasses';
import { InputComponent } from '@/shared/components';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { finalize } from 'rxjs';
import { ICheckExistStudentRequestPayload, ICheckExistStudentRequestResponse } from '../../models';

@Component({
  selector: 'app-student-check-exist-form-dialog',
  templateUrl: './check-exist-form-dialog.component.html',
  imports: [Dialog, ReactiveFormsModule, InputComponent, FormFooterActionsComponent],
})
export class StudentCheckExistFormDialogComponent extends AbstractFormDialog<
  ICheckExistStudentRequestPayload,
  ICheckExistStudentRequestResponse
> {
  constructor(private readonly http: HttpClient) {
    super();
  }
  // @Input() submitService!: (
  //   payload: ICheckExistStudentRequestPayload,
  // ) => Observable<ICheckExistStudentRequestResponse>;

  @Input() submitApiRoute!: string;
  @Input() loading = false;

  @Output() override onSubmit = new EventEmitter<ICheckExistStudentRequestResponse>();

  form = this.fb.group({
    nationalCode: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  override submit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.submitLoading.set(true);
      this.submitForm(this.form.value as ICheckExistStudentRequestPayload)
        .pipe(
          finalize(() => {
            this.submitLoading.set(false);
            this.form.enable();
          }),
        )
        .subscribe((res) => {
          console.log('res');
          console.log(res);

          this.onSubmit.emit({
            ...res,
            studentInfo: {
              ...(res.studentInfo || {}),
              nationalCode: this.form.controls.nationalCode.value,
            },
          });
          this.form.reset();
        });
    }
  }

  submitForm(payload: ICheckExistStudentRequestPayload) {
    return this.http.post<ICheckExistStudentRequestResponse>(this.submitApiRoute, payload);
    // return this.submitService(payload);
  }
}
