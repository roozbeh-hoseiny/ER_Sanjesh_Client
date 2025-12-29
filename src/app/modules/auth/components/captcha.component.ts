import { CaptchaTemplateComponent } from '@/shared/components/captcha/template.component';
import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthStore } from '../state';

@Component({
  selector: 'app-auth-captcha',
  templateUrl: './captcha.component.html',
  imports: [CaptchaTemplateComponent],
})
export class AuthCaptchaComponent {
  private readonly store = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  constructor() {}

  captchaControl = this.fb.control<string>('', { nonNullable: true });

  readonly isCaptchaExpired = this.store.captchaIsExpired;
  readonly isCaptchaLoading = this.store.captchaLoading;
  readonly captchaImageSrc = this.store.captchaImageSrc;

  ngOnInit() {
    this.store.requestNewCaptcha();
    this.captchaControl.valueChanges.subscribe((value) => {
      this.store.setCaptchaCode(value);
    });
  }

  resetCaptcha(): void {
    this.captchaControl.setValue('');
    this.store.resetCaptcha();
  }

  onRefreshCaptcha(): void {
    this.store.resetCaptcha();
  }
  onRefreshCaptchaImage(): void {
    this.store.resetCaptcha();
  }
}
