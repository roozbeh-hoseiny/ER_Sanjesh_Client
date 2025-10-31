import { StatesSelectComponent } from '@/shared/catalog';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-school-address-form',
  templateUrl: './school-address-form.component.html',
  imports: [ReactiveFormsModule, UikitFieldComponent, Textarea, StatesSelectComponent, InputText],
})
export class SchoolAddressFormComponent {
  constructor() {}
  private fb = inject(FormBuilder);

  form = this.fb.group({
    address: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
  });
}
