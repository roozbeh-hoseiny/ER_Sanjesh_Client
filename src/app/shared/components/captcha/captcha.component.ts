import { CaptchaService } from '@/core/services/captcha.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CaptchaTemplateComponent } from './template.component';

@Component({
  selector: 'app-shared-captcha',
  templateUrl: './captcha.component.html',
  imports: [ReactiveFormsModule, CaptchaTemplateComponent],
})
export class SharedCaptchaComponent implements OnInit {
  @Input() control!: FormControl<string>;

  private service = inject(CaptchaService);

  readonly isCaptchaExpired = this.service.captchaIsExpired;
  readonly isCaptchaLoading = this.service.loading;
  readonly captchaImageSrc = this.service.captchaImageSrc;

  ngOnInit() {
    this.service.requestNewCaptcha();
  }

  resetCaptcha(): void {
    this.control.setValue('');
    this.service.renewCaptcha();
  }

  onRefreshCaptcha(): void {
    this.resetCaptcha();
  }
  onRefreshCaptchaImage(): void {
    this.resetCaptcha();
  }
}
