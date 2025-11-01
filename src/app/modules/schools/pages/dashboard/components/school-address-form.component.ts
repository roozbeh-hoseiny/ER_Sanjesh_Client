import { ISchoolAddress, ISchoolAddressRequest, ISchoolResponse } from '@/modules/schools/models';
import { SchoolsInfoService } from '@/modules/schools/services';
import { StatesSelectComponent } from '@/shared/catalog';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-school-address-form',
  templateUrl: './school-address-form.component.html',
  imports: [
    ReactiveFormsModule,
    UikitFieldComponent,
    Textarea,
    StatesSelectComponent,
    InputText,
    ButtonDirective,
  ],
})
export class SchoolAddressFormComponent {
  @Input() address!: ISchoolAddress;
  @Output() closeForm = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<ISchoolResponse>();
  constructor() {}

  onSubmitLoading = signal<boolean>(false);

  private schoolService = inject(SchoolsInfoService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    address: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    state: ['', [Validators.required]],
  });

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.onSubmitLoading.set(true);
    const payload = { id: '', ...this.form.value } as ISchoolAddressRequest;
    this.schoolService.editAddress(payload).subscribe({
      next: (value) => {
        this.onSubmitLoading.set(false);
        // this.submitForm.emit(value);
      },
      error: (err) => {
        this.onSubmitLoading.set(false);
      },
    });
  }
  close() {
    // this.closeForm.emit();
  }
}
