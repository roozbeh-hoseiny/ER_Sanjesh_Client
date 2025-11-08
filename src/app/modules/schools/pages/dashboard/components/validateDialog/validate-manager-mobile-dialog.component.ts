import { ToastService } from '@/core/services/toast.service';
import { SchoolsAuthService } from '@/modules/schools/services';
import { Component, effect, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputOtp } from 'primeng/inputotp';

@Component({
  selector: 'school-validate-manager-mobile-dialog',
  templateUrl: './validate-manager-mobile-dialog.component.html',
  imports: [DialogModule, Button, InputOtp, FormsModule],
})
export class ValidateManagerMobileDialogComponent {
  private visibleSignal = signal(false);
  initialLoading = signal(false);
  submitLoading = signal(false);
  code = signal<string>('');

  @Input()
  set visible(v: boolean) {
    this.visibleSignal.set(!!v);
  }

  get visible() {
    return this.visibleSignal();
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<void>();

  constructor(
    private authService: SchoolsAuthService,
    private toastService: ToastService,
  ) {
    this.sendSMSRequest();

    effect(() => {
      this.visibleChange.emit(this.visibleSignal());
    });
  }

  sendSMSRequest() {
    this.authService.sendOTPSmsForManagerMobile().subscribe({
      next: () => {
        this.initialLoading.set(false);
      },
      error: () => {
        this.initialLoading.set(false);
        this.toastService.warn({ text: 'متاسفانه مشکلی پیش آمده' });
        this.close();
      },
    });
  }

  close() {
    this.visibleSignal.set(false);
  }

  submit() {
    this.submitLoading.set(true);
    this.authService
      .verifyManagerMobile({
        otp: this.code(),
      })
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.toastService.success({ text: 'شماره تلفن مدیریت با موفقیت تایید شد.' });
          this.onSubmit.emit();
          this.close();
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
