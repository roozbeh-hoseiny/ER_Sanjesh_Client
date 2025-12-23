import { SharedCaptchaComponent } from '@/shared/components/captcha/captcha.component';
import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthStore } from '../state';

@Component({
  selector: 'app-auth-captcha',
  templateUrl: './captcha.component.html',
  imports: [SharedCaptchaComponent],
})
export class AuthCaptchaComponent {
  private readonly store = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  constructor() {}

  captchaControl = this.fb.control<string>('', { nonNullable: true });

  ngOnInit() {
    this.captchaControl.valueChanges.subscribe((value) => {
      this.store.setCaptchaCode(value);
    });
  }
}
