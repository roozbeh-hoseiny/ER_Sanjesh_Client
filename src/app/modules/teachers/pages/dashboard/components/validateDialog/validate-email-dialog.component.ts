import { ToastService } from '@/core/services/toast.service';
import { TeachersAuthService } from '@/modules/teachers/services';
import { Component, effect, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputOtp } from 'primeng/inputotp';

@Component({
  selector: 'teacher-validate-email-dialog',
  templateUrl: './validate-email-dialog.component.html',
  imports: [DialogModule, Button, InputOtp, FormsModule],
})
export class TeacherValidateEmailDialogComponent {
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
    private authService: TeachersAuthService,
    private toastService: ToastService,
  ) {
    effect(() => {
      if (this.visibleSignal()) {
        this.sendEmailRequest();
      }
      this.visibleChange.emit(this.visibleSignal());
    });
  }

  sendEmailRequest() {
    this.authService.sendOTPEmailForEmail().subscribe({
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
      .verifyEmail({
        otp: this.code(),
      })
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.toastService.success({ text: 'ایمیل با موفقیت تایید شد.' });
          this.onSubmit.emit();
          this.close();
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
