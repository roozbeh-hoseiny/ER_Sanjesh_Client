import { ToastService } from '@/core/services/toast.service';
import { mobileValidator } from '@/core/validators/mobile.validator';
import { ISchoolInfoRequest, ISchoolResponse } from '@/modules/schools/models';
import { ExamApplicationTypesSelectComponent, SchoolGendersSelect } from '@/shared/catalog';
import { InputComponent } from '@/shared/components';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { SchoolPersonFormComponent } from '../school-person-form.component';
import { SchoolDetailsCardsStore } from '../store';

@Component({
  selector: 'app-school-info-form',
  templateUrl: './school-info-form.component.html',
  imports: [
    ReactiveFormsModule,
    UikitFieldComponent,
    Divider,
    ButtonDirective,
    SchoolGendersSelect,
    SchoolPersonFormComponent,
    InputComponent,
    ToggleSwitch,
    ExamApplicationTypesSelectComponent,
  ],
})
export class SchoolInfoFormComponent {
  private detailsStore = inject(SchoolDetailsCardsStore);

  @Output() closeForm = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();

  constructor() {}

  private readonly toastService = inject(ToastService);

  onSubmitLoading = signal<boolean>(false);

  private fb: FormBuilder = inject(FormBuilder);
  form = this.fb.group({
    name: ['', [Validators.required]],
    boyOrGirl: [0, [Validators.required]],
    conductExam: [false],
    examHallCapacity: [0, [Validators.required, Validators.min(1)]],
    phoneNumber: ['', [Validators.maxLength(11)]],
    examApplicantType: [0, Validators.required],
    scannerType: [''],

    managerInfo: this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobile: ['', [Validators.required, mobileValidator()]],
      email: ['', [Validators.required, Validators.email]],
      gender: [true, [Validators.required]],
    }),
  });

  ngOnInit() {
    const cur = this.detailsStore.school();
    if (cur) {
      this.form.patchValue(cur as ISchoolResponse);
      this.form.controls.examApplicantType.setValue(cur.examApplicantTypeId);
      this.form.controls.conductExam.setValue(cur.conductExam);
      this.form.controls.scannerType.setValue(cur.scannerType);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.onSubmitLoading.set(true);
    const cur = this.detailsStore.school() as ISchoolResponse;
    const payload = { id: cur.id, ...this.form.value } as ISchoolInfoRequest;
    this.detailsStore.editInfo(payload).subscribe({
      next: (value) => {
        this.onSubmitLoading.set(false);
        this.submitForm.emit();
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
