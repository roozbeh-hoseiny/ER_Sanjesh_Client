import { ToastService } from '@/core/services/toast.service';
import { mobileValidator } from '@/core/validators';
import { AbstractFormDialog } from '@/shared/abstractClasses';
import {
  AcademicYearsSelectComponent,
  EducationalLevelsSelectComponent,
  FieldsSelectComponent,
  StatesSelectComponent,
} from '@/shared/catalog';
import { GenderSelectComponent } from '@/shared/catalog/gender/gender-select.component';
import { InputComponent } from '@/shared/components';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { UikitFlatpickrJalaliComponent } from '@/uikit';
import { CheckboxComponent } from '@/uikit/checkbox/checkbox.component';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { finalize } from 'rxjs';
import { IStudentRequestPayload, IStudentRequestResponse } from '../../models';

@Component({
  selector: 'app-signup-student-form-dialog',
  templateUrl: './signup-form-dialog.component.html',
  imports: [
    InputComponent,
    Dialog,
    ReactiveFormsModule,
    GenderSelectComponent,
    UikitFlatpickrJalaliComponent,
    StatesSelectComponent,
    FormFooterActionsComponent,
    AcademicYearsSelectComponent,
    EducationalLevelsSelectComponent,
    FieldsSelectComponent,
    CheckboxComponent,
  ],
})
export class SignupStudentFormDialogComponent extends AbstractFormDialog<
  IStudentRequestPayload,
  IStudentRequestResponse
> {
  // @Input() addService!: (payload: IStudentRequestPayload) => Observable<IStudentRequestResponse>;
  @Input() addServiceAPIRoute!: string;
  @Input() nationalCode?: string;

  constructor(
    private readonly http: HttpClient,
    private readonly toast: ToastService,
  ) {
    super();
    this.setNationalCode();
  }

  form = this.fb.group({
    firstName: this.fb.control<string>(this.initialValues?.firstName || '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: this.fb.control<string>(this.initialValues?.lastName || '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    gender: this.fb.control<number>(this.initialValues?.gender === false ? 0 : 1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birthDate: this.fb.control<string>(this.initialValues?.birthDate || '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    nationalCode: this.fb.control<string>(
      this.initialValues?.nationalCode || this.nationalCode || '',
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    idCardNumber: this.fb.control<string>(this.initialValues?.idCardNumber || '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fatherName: this.fb.control<string>(this.initialValues?.fatherName || '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: this.fb.control<string>(this.initialValues?.email || '', {
      validators: [Validators.email],
    }),
    mobile: this.fb.control<string>(this.initialValues?.mobile || '', {
      nonNullable: true,
      validators: [Validators.required, mobileValidator()],
    }),
    provinceId: this.fb.control<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cityId: this.fb.control<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phoneNumber: this.fb.control<string>(this.initialValues?.phoneNumber || '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isLeftHanded: this.fb.control<boolean>(this.initialValues?.isLeftHanded || false, {
      nonNullable: true,
    }),
    isForeigner: this.fb.control<boolean>(this.initialValues?.isForeigner || false, {
      nonNullable: true,
    }),
    religionId: this.fb.control<number>(this.initialValues?.religionId || 0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    denominationId: this.fb.control<number>(this.initialValues?.denominationId || 0, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    isAlreadyInThisSchool: this.fb.control<boolean>(false, {
      nonNullable: true,
    }),
    academicYear: this.fb.control(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    educationalLevelId: this.fb.control(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fieldOfStudyId: this.fb.control(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  override submit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const formValue = this.form.value;
      this.form.disable();
      this.submitLoading.set(true);

      // @ts-ignore
      this.submitForm(formValue!)
        .pipe(
          finalize(() => {
            this.submitLoading.set(false);
            this.form.enable();
            this.form.controls.nationalCode.disable();
          }),
        )
        .subscribe((res) => {
          this.form.reset();
          this.toast.success({ text: 'عملیات با موفقیت انجام شد.' });
          this.onSubmit.emit(res);
        });
    }
  }

  submitForm(payload: IStudentRequestPayload) {
    return this.http.post<IStudentRequestResponse>(this.addServiceAPIRoute, payload);
  }

  ngOnChanges() {
    this.setNationalCode();
  }

  setNationalCode() {
    if (this.nationalCode) {
      this.form.controls.nationalCode.patchValue(this.nationalCode);
      this.form.controls.nationalCode.disable();
    }
  }
}
