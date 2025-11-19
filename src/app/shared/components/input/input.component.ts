import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, UikitFieldComponent],
  templateUrl: './input.component.html',
})
export class InputComponent {
  @Input() type: 'simple' | 'postalCode' | 'mobile' | 'phone' | 'email' = 'simple';
  @Input() control!: FormControl<Maybe<any>>;
  @Input() name!: string;
  @Input() label: string = '';
  @Input() customPlaceholder?: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() size?: 'small' | 'large';
  @Input() autocomplete?: string = 'off';
  @Output() valueChange = new EventEmitter<string>();

  onInput(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.valueChange.emit(v);
  }

  get placeholder(): string | null {
    if (this.customPlaceholder) return this.customPlaceholder;
    switch (this.type) {
      case 'mobile':
        return '09xxxxxxxx';
      case 'postalCode':
        return 'کد پستی (۱۰ رقم)';
      case 'phone':
        return 'شماره تلفن';
      case 'email':
        return 'آدرس ایمیل خود را وارد کنید';
      default:
        return '';
    }
  }

  get inputMode(): string | null {
    switch (this.type) {
      case 'mobile':
      case 'phone':
      case 'postalCode':
        return 'numeric';
      default:
        return 'text';
    }
  }

  get maxLength(): number | null {
    switch (this.type) {
      case 'mobile':
        return 11;
      case 'postalCode':
        return 10;
      case 'phone':
        return 11;
      default:
        return null;
    }
  }

  get inputClass(): string {
    switch (this.type) {
      case 'mobile':
      case 'phone':
        return 'ltrInput';
      case 'email':
      case 'postalCode':
        return 'ltrInput rtlPlaceholder';
      default:
        return '';
    }
  }

  get htmlType(): string {
    switch (this.type) {
      case 'email':
        return 'email';
      default:
        return 'text';
    }
  }

  get isRequired(): boolean {
    return this.required || this.control.hasValidator(Validators.required);
  }
}
