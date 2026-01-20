import { MustMatch, password } from '@/core/validators';
import { AbstractForm } from '@/shared/abstractClasses';
import { UikitFieldComponent } from '@/uikit';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputOtp } from 'primeng/inputotp';
import { Password } from 'primeng/password';
import { finalize } from 'rxjs';
import { FormFooterActionsComponent } from '../formFooterActions/form-footer-actions.component';

interface IChangePasswordRequestPayload {
  otp: string;
  password: string;
}

@Component({
  selector: 'change-password-otp-step',
  templateUrl: './otp-step.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputOtp,
    UikitFieldComponent,
    Password,
    FormFooterActionsComponent,
    ButtonDirective,
  ],
})
export class ChangePasswordOtpStepComponent extends AbstractForm<
  IChangePasswordRequestPayload,
  {}
> {
  @Input() apiRoute!: string;
  @Input() resendOTPApiRoute!: string;

  private readonly http = inject(HttpClient);
  override showSuccessMessage = true;
  override successMessage = 'تغییر گذرواژه با موفقیت انجام شد.';

  form = this.fb.group(
    {
      password: this.fb.control('', { validators: [password()], nonNullable: true }),
      confirmPassword: this.fb.control('', { validators: [password()], nonNullable: true }),
    },
    {
      validators: [MustMatch('password', 'confirmPassword')],
    },
  );

  resendLoading = signal(false);
  otpCode = signal<string>('');
  countdown = signal<number>(60 * 2); // 2 minutes

  startCountdown() {
    const interval = setInterval(() => {
      if (this.countdown() > 0) {
        this.countdown.set(this.countdown() - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  resendOtp() {
    this.resendLoading.set(true);
    this.http
      .get(this.resendOTPApiRoute)
      .pipe(
        finalize(() => {
          this.resendLoading.set(false);
        }),
      )
      .subscribe(() => {
        this.otpCode.set('');
        this.countdown.set(120);
        this.startCountdown();
      });
  }

  submitForm(payload: IChangePasswordRequestPayload) {
    console.log(payload);

    return this.http.post(this.apiRoute, { password: payload.password, otp: this.otpCode() });
  }

  ngOnInit() {
    this.startCountdown();
  }
}
