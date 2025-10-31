import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-gender-select',
  templateUrl: './gender-select.component.html',
  imports: [UikitFieldComponent, Select],
})
export class GenderSelectComponent {
  constructor() {}

  @Input() control!: Maybe<AbstractControl<any, any>>;
}
