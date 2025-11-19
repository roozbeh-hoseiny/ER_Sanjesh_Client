import { FormErrorsService } from '@/core/services/form-errors.service';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { UikitLabelComponent } from './uikit-label.component';

type PSize = 'small' | 'normal' | 'large';

@Component({
  selector: 'uikit-field',
  standalone: true,
  imports: [CommonModule, UikitLabelComponent, MessageModule],
  templateUrl: './uikit-field.component.html',
})
export class UikitFieldComponent {
  @Input() label!: string;
  @Input() name!: string;
  @Input() pSize: PSize = 'normal';
  @Input() className?: string;
  @Input() invalid?: boolean = false;
  // accept a FormControl or AbstractControl to display errors for
  @Input() control?: AbstractControl | null;

  private errorsService = inject(FormErrorsService);

  get showErrors(): boolean {
    if (!this.control) return !!this.invalid;
    return !!(this.control.invalid && (this.control.touched || this.control.dirty));
  }

  get errors(): string[] {
    if (!this.control) return this.invalid ? ['خطا'] : [];
    return this.errorsService.getErrors(this.control, this.label).map((m) => m.message);
  }
}
