import { ToastService } from '@/core/services/toast.service';
import { SchoolsAuthService } from '@/modules/schools/services';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { Component, effect, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputOtp } from 'primeng/inputotp';
import { ProgressSpinner } from 'primeng/progressspinner';
import { catchError, finalize, throwError } from 'rxjs';

@Component({
  selector: 'school-validate-manager-mobile-dialog',
  templateUrl: './validate-manager-mobile-dialog.component.html',
  imports: [DialogModule, InputOtp, FormsModule, FormFooterActionsComponent, ProgressSpinner],
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
    effect(() => {
      if (this.visibleSignal()) {
        this.sendSMSRequest();
      }
      this.visibleChange.emit(this.visibleSignal());
    });
  }

  sendSMSRequest() {
    this.initialLoading.set(true);
    this.authService
      .sendOTPSmsForManagerMobile()
      .pipe(
        catchError((err) => {
          this.toastService.warn({ text: 'متاسفانه مشکلی پیش آمده' });
          this.close();
          return throwError(err);
        }),
        finalize(() => {
          this.initialLoading.set(false);
        }),
      )
      .subscribe(() => this.toastService.success({ text: 'کد تاییدیه برای شما ارسال شد.' }));
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
      .pipe(
        finalize(() => {
          this.submitLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.success({ text: 'شماره تلفن مدیریت با موفقیت تایید شد.' });
          this.onSubmit.emit();
          this.close();
        },
      });
  }
}
