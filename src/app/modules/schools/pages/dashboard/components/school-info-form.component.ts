import { ToastService } from '@/core/services/toast.service';
import { mobileValidator } from '@/core/validators/mobile.validator';
import { ISchoolInfoRequest, ISchoolResponse } from '@/modules/schools/models';
import { SchoolsInfoService } from '@/modules/schools/services';
import { SchoolGendersSelect } from '@/shared/catalog';
import { GenderSelectComponent } from '@/shared/catalog/gender/gender-select.component';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-school-info-form',
  templateUrl: './school-info-form.component.html',
  imports: [
    ReactiveFormsModule,
    UikitFieldComponent,
    InputText,
    Divider,
    ButtonDirective,
    GenderSelectComponent,
    SchoolGendersSelect,
  ],
})
export class SchoolInfoFormComponent {
  @Input() info!: ISchoolResponse;

  @Output() closeForm = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<ISchoolResponse>();

  constructor() {}

  private readonly schoolService = inject(SchoolsInfoService);
  private readonly toastService = inject(ToastService);

  onSubmitLoading = signal<boolean>(false);

  private fb: FormBuilder = inject(FormBuilder);
  form = this.fb.group({
    name: ['', [Validators.required]],
    boyOrGirl: [0, [Validators.required]],
    examHallCapacity: [0, [Validators.required, Validators.min(1)]],
    phoneNumber: ['', [Validators.required, mobileValidator()]],

    managerInfo: this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobile: ['', [Validators.required, mobileValidator()]],
      email: ['', [Validators.required, Validators.email]],
      gender: [true, [Validators.required]],
    }),
  });

  ngOnInit() {
    this.form.patchValue(this.info);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.onSubmitLoading.set(true);
    const payload = { id: this.info.id, ...this.form.value } as ISchoolInfoRequest;
    this.schoolService.editInfo(payload).subscribe({
      next: (value) => {
        this.onSubmitLoading.set(false);
        this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
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
