import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { schoolGenders } from './schoolGenders.const';

@Component({
  selector: 'app-school-genders-select',
  templateUrl: './app-school-genders-select.component.html',
  imports: [CommonModule, UikitFieldComponent, Select, ReactiveFormsModule],
})
export class SchoolGendersSelect {
  @Input() control!: Maybe<AbstractControl<any, any>>;

  readonly genders = schoolGenders;

  get formControl(): FormControl | undefined {
    return this.control as FormControl | undefined;
  }
}
