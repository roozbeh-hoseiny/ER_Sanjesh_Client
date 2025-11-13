import { ToastService } from '@/core/services/toast.service';
import { mobileValidator } from '@/core/validators/mobile.validator';
import { ISchoolInfoRequest } from '@/modules/schools/models';
import { ITeacherMeResponse } from '@/modules/teachers/models';
import { GenderSelectComponent } from '@/shared/catalog/gender/gender-select.component';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TeacherDetailsCardsStore } from '../dataStore/store';

@Component({
  selector: 'app-school-info-form',
  templateUrl: './info-form.component.html',
  imports: [
    ReactiveFormsModule,
    UikitFieldComponent,
    GenderSelectComponent,
    InputText,
    ButtonDirective,
  ],
})
export class SchoolInfoFormComponent {
  private detailsStore = inject(TeacherDetailsCardsStore);

  @Output() closeForm = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<ITeacherMeResponse>();

  constructor() {}

  private readonly toastService = inject(ToastService);

  onSubmitLoading = signal<boolean>(false);

  private fb: FormBuilder = inject(FormBuilder);
  form = this.fb.group({
    name: ['', [Validators.required]],
    gender: [true, [Validators.required]],
    mobile: ['', [Validators.required, mobileValidator()]],
  });

  ngOnInit() {
    const cur = this.detailsStore.info();
    if (cur) {
      this.form.patchValue(cur);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.onSubmitLoading.set(true);
    const cur = this.detailsStore.info() as ITeacherMeResponse;
    const payload = { id: cur.id, ...this.form.value } as ISchoolInfoRequest;
    this.detailsStore.editLoginInfo(payload).subscribe({
      next: (value) => {
        this.onSubmitLoading.set(false);
        this.submitForm.emit(value);
      },
      error: (err) => {
        this.onSubmitLoading.set(false);
      },
    });
  }
  close() {
    this.closeForm.emit();
  }
}
