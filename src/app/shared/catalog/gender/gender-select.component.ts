import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-gender-select',
  templateUrl: './gender-select.component.html',
  imports: [CommonModule, UikitFieldComponent, Select, ReactiveFormsModule],
})
export class GenderSelectComponent {
  constructor() {}

  @Input() control!: Maybe<AbstractControl<any, any>>;

  get formControl(): FormControl | undefined {
    return this.control as FormControl | undefined;
  }
}
