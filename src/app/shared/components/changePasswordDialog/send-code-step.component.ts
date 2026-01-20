import { Maybe } from '@/core';
import { AbstractForm } from '@/shared/abstractClasses';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedCaptchaComponent } from '../captcha/captcha.component';
import { FormFooterActionsComponent } from '../formFooterActions/form-footer-actions.component';

@Component({
  selector: 'change-password-send-code-step',
  templateUrl: './send-code-step.component.html',
  imports: [SharedCaptchaComponent, FormFooterActionsComponent, ReactiveFormsModule],
})
export class ChangePasswordSendCodeStepComponent extends AbstractForm<{}, {}> {
  @Input() apiRoute!: string;

  private readonly http = inject(HttpClient);

  captchaId = signal<Maybe<string>>(null);

  form = this.fb.group({
    captchaCode: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
  });

  setCaptchaId = (id: Maybe<string>) => {
    this.captchaId.set(id);
  };

  submitForm() {
    const baseHeaders = {
      'x-CaptchaId': this.captchaId() as string,
      'x-CaptchaValue': this.form.controls.captchaCode.value as string,
    };
    return this.http.get(this.apiRoute, {
      headers: baseHeaders,
    });
  }
}
