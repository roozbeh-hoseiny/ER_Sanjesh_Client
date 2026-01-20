import { Maybe } from '@/core';
import { CaptchaService } from '@/core/services/captcha.service';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CaptchaTemplateComponent } from './template.component';

@Component({
  selector: 'app-shared-captcha',
  templateUrl: './captcha.component.html',
  imports: [ReactiveFormsModule, CaptchaTemplateComponent],
})
export class SharedCaptchaComponent implements OnInit {
  @Input() control!: FormControl<string>;

  @Output() OnChangeCaptchaId = new EventEmitter<Maybe<string>>();

  private service = inject(CaptchaService);
  private captchaId = computed(() => this.service.captchaId());

  readonly isCaptchaExpired = this.service.captchaIsExpired;
  readonly isCaptchaLoading = this.service.loading;
  readonly captchaImageSrc = this.service.captchaImageSrc;

  constructor() {
    effect(() => {
      this.OnChangeCaptchaId.emit(this.captchaId());
    });
  }

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
