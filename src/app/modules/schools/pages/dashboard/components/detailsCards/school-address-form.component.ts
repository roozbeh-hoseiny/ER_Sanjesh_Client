import { ISchoolAddress, ISchoolAddressRequest, ISchoolResponse } from '@/modules/schools/models';
import { StatesSelectComponent } from '@/shared/catalog';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { SchoolDetailsCardsStore } from './store';

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
  @Output() closeForm = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<ISchoolResponse>();

  onSubmitLoading = signal<boolean>(false);

  private detailsStore = inject(SchoolDetailsCardsStore);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    address: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    state: [0, [Validators.required]],
    city: [0, [Validators.required]],
  });

  ngOnInit() {
    const cur = this.detailsStore.school();
    if (cur && cur.address) {
      this.form.patchValue(cur.address as ISchoolAddress);
      if (cur.address.regionType === 3) {
        this.form.controls.city.setValue(cur.address.regionId);
      }
      if (cur.address.regionType === 2) {
        this.form.controls.state.setValue(cur.address.regionId);
      }
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.onSubmitLoading.set(true);
    const cur = this.detailsStore.school();
    const payload = {
      id: cur?.id ?? '',
      ...this.form.value,
      regionId: this.form.controls.city.value,
    } as ISchoolAddressRequest;
    this.detailsStore.editAddress(payload).subscribe({
      next: () => {
        this.onSubmitLoading.set(false);
        this.submitForm.emit();
      },
      error: () => {
        this.onSubmitLoading.set(false);
      },
    });
  }
  close() {
    // this.closeForm.emit();
  }
}
