import { ISchoolResponse } from '@/modules/schools/models';
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

  private fb: FormBuilder = inject(FormBuilder);
  form = this.fb.group({
    name: ['', [Validators.required]],
    boyOrGirl: [0, [Validators.required]],
    examHallCapacity: [0, [Validators.required, Validators.min(1)]],

    managerInfo: this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: [true, [Validators.required]],
    }),
  });

  ngOnInit() {
    this.form.patchValue(this.info);
  }

  onSubmitLoading = signal<boolean>(false);

  submit() {}
  close() {
    this.closeForm.emit();
  }
}
