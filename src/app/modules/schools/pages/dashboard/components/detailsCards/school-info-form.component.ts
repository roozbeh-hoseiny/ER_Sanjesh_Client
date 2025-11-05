import { ToastService } from '@/core/services/toast.service';
import { mobileValidator } from '@/core/validators/mobile.validator';
import { ISchoolInfoRequest, ISchoolResponse } from '@/modules/schools/models';
import { SchoolGendersSelect } from '@/shared/catalog';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { SchoolPersonFormComponent } from './school-person-form.component';
import { SchoolDetailsCardsStore } from './store';

@Component({
  selector: 'app-school-info-form',
  templateUrl: './school-info-form.component.html',
  imports: [
    ReactiveFormsModule,
    UikitFieldComponent,
    InputText,
    Divider,
    ButtonDirective,
    SchoolGendersSelect,
    SchoolPersonFormComponent,
  ],
})
export class SchoolInfoFormComponent {
  // read data from store instead of input
  private detailsStore = inject(SchoolDetailsCardsStore);

  @Output() closeForm = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<ISchoolResponse>();

  constructor() {}

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
    const cur = this.detailsStore.school();
    if (cur) {
      this.form.patchValue(cur as ISchoolResponse);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.onSubmitLoading.set(true);
    const cur = this.detailsStore.school();
    const payload = { id: cur?.id ?? '', ...this.form.value } as ISchoolInfoRequest;
    // use store's editInfo which also updates store state and shows toast
    this.detailsStore.editInfo(payload).subscribe({
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
