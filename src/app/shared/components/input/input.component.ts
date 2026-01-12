import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputGroupModule,
    UikitFieldComponent,
    ToggleSwitch,
    InputGroupAddon,
    InputNumberModule,
  ],
  templateUrl: './input.component.html',
})
export class InputComponent {
  @Input() type:
    | 'simple'
    | 'postalCode'
    | 'mobile'
    | 'phone'
    | 'email'
    | 'checkbox'
    | 'switch'
    | 'price' = 'simple';
  @Input() control!: FormControl<Maybe<any>>;
  @Input() name!: string;
  @Input() label: string = '';
  @Input() placeholder?: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() size?: 'small' | 'large';
  @Input() autocomplete?: string = 'off';
  @Input() showErrors = false;
  @Input() hint?: string;
  @Input() isLtrInput = false;
  @Output() valueChange = new EventEmitter<string | number>();
  @Output() blur = new EventEmitter<void>();

  onInput(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.valueChange.emit(this.type === 'price' ? parseFloat(v) : v);
  }

  get preparedPlaceholder(): string | null {
    if (this.placeholder) return this.placeholder;
    switch (this.type) {
      case 'mobile':
        return '09xxxxxxxx';
      case 'postalCode':
        return 'کد پستی (۱۰ رقم)';
      case 'phone':
        return 'شماره تلفن';
      case 'email':
        return 'آدرس ایمیل خود را وارد کنید';
      case 'price':
        return 'مبلغ';
      default:
        return '';
    }
  }

  get inputMode(): string | null {
    switch (this.type) {
      case 'mobile':
      case 'phone':
      case 'postalCode':
      case 'price':
        return 'numeric';
      default:
        return 'text';
    }
  }

  get isNumeric(): boolean {
    return this.inputMode === 'numeric';
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
    let inputClass = [];
    switch (this.type) {
      case 'mobile':
      case 'phone':
      case 'price':
        inputClass.push('ltrInput');
        break;
      case 'email':
      case 'postalCode':
        inputClass.push('ltrInput', 'rtlPlaceholder');
        break;
    }

    if (this.isLtrInput) {
      inputClass.push('ltrInput', 'rtlPlaceholder');
    }
    return inputClass.join(' ');
  }

  get htmlType(): string {
    switch (this.type) {
      case 'email':
        return 'email';
      case 'mobile':
      case 'phone':
      case 'price':
      case 'postalCode':
        return 'number';
      case 'checkbox':
        return 'checkbox';
      case 'switch':
        return 'radio';
      default:
        return 'text';
    }
  }

  get isRequired(): boolean {
    return this.required || this.control.hasValidator(Validators.required);
  }
}
