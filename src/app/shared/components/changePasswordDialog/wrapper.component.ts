import { TRoles } from '@/core';
import { SCHOOLS_API_ROUTES } from '@/modules/schools/constants';
import { AbstractDialog } from '@/shared/abstractClasses/abstract-dialog';
import { Component, computed, Input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { ChangePasswordOtpStepComponent } from './otp-step.component';
import { ChangePasswordSendCodeStepComponent } from './send-code-step.component';

@Component({
  selector: 'change-password-form-dialog',
  templateUrl: './wrapper.component.html',
  imports: [
    Dialog,
    ReactiveFormsModule,
    ChangePasswordSendCodeStepComponent,
    ChangePasswordOtpStepComponent,
  ],
})
export class ChangePasswordFormDialogComponent extends AbstractDialog {
  @Input() activeRole!: TRoles;

  activeStep = signal<'sendCode' | 'OTP'>('sendCode');

  ngOnChanges() {
    if (!this.visible) {
      this.activeStep.set('sendCode');
    }
  }

  toOtp() {
    this.activeStep.set('OTP');
  }

  sendOtpApiRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.sendSmsOtpForChangePassword(),
  };
  resendOtpApiRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.resendSmsOtpForChangePassword(),
  };
  changePasswordApiRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.changePassword(),
  };

  sendOtpApiRoute = computed(
    () =>
      // @ts-ignore
      this.sendOtpApiRoutes[this.activeRole.toUpperCase()],
  );
  changePasswordApiRoute = computed(
    () =>
      // @ts-ignore
      this.changePasswordApiRoutes[this.activeRole.toUpperCase()],
  );
  resendOtpApiRoute = computed(
    () =>
      // @ts-ignore
      this.resendOtpApiRoutes[this.activeRole.toUpperCase()],
  );

  onPasswordChange() {
    this.visibleChange.emit();
  }

  close() {
    this.visibleChange.emit();
  }
}
