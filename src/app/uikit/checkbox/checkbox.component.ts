import { Maybe } from '@/core';
import { UikitLabelComponent } from '@/uikit';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  imports: [Checkbox, ReactiveFormsModule, FormsModule, UikitLabelComponent],
})
export class CheckboxComponent {
  @Input() label!: string;
  @Input() control!: FormControl<Maybe<boolean>>;
  @Input() name!: string;
  @Input() withLabelSpacing = false;
  constructor() {}
}
