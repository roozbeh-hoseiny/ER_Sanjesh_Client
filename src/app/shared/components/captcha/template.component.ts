import { Maybe } from '@/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-captcha-template',
  templateUrl: './template.component.html',
  imports: [ProgressSpinner, InputGroup, InputText, InputGroupAddon, Button, ReactiveFormsModule],
})
export class CaptchaTemplateComponent {
  @Input() control!: FormControl<string>;
  @Input() isCaptchaExpired: boolean = false;
  @Input() isCaptchaLoading: boolean = false;
  @Input() captchaImageSrc!: Maybe<string>;
  @Output() onRenewCaptcha = new EventEmitter<void>();
  constructor() {}

  resetCaptcha(): void {
    this.control.setValue('');
    this.onRenewCaptcha.emit();
  }

  onRefreshCaptcha(): void {
    this.resetCaptcha();
  }
  onRefreshCaptchaImage(): void {
    this.resetCaptcha();
  }
}
