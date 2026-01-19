import { MustMatch, password } from '@/core/validators';
import { ISchoolLoginInfoRequest, ISchoolLoginInfoRequestResponse } from '@/modules/schools/models';
import { AbstractForm } from '@/shared/abstractClasses';
import { InputComponent } from '@/shared/components';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { UikitFieldComponent } from '@/uikit';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Password } from 'primeng/password';
import { SchoolDetailsCardsStore } from '../store';

@Component({
  selector: 'school-login-info-form',
  templateUrl: './login-info-form.component.html',
  imports: [
    ReactiveFormsModule,
    ButtonDirective,
    InputComponent,
    UikitFieldComponent,
    Password,
    FormFooterActionsComponent,
  ],
})
export class SchoolLoginInfoFormComponent extends AbstractForm<
  ISchoolLoginInfoRequest,
  ISchoolLoginInfoRequestResponse,
  ISchoolLoginInfoRequest
> {
  private readonly detailsStore = inject(SchoolDetailsCardsStore);

  submitForm(payload: ISchoolLoginInfoRequest) {
    return this.detailsStore.updateLoginInfo(payload);
  }

  form = this.fb.group(
    {
      username: this.fb.control(this.initialValues?.username, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      mobile: this.fb.control(this.initialValues?.mobile, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      email: this.fb.control(this.initialValues?.email, {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: this.fb.control('', {
        validators: [Validators.required, password()],
        nonNullable: true,
      }),
      confirmPassword: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    },

    {
      validators: [MustMatch('password', 'confirmPassword')],
    },
  );

  ngOnChanges() {
    this.form.patchValue({ ...this.initialValues });
  }
}
