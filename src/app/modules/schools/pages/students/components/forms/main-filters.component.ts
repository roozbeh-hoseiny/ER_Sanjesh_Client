import {
  AcademicYearsSelectComponent,
  EducationalLevelsSelectComponent,
  FieldsSelectComponent,
} from '@/shared/catalog';
import { CheckboxComponent } from '@/uikit/checkbox/checkbox.component';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { IGetSchoolStudentsRequestPayload } from '../../../../../../shared/components/modules/students';

@Component({
  selector: 'school-students-main-filters',
  templateUrl: './main-filters.component.html',
  imports: [
    ReactiveFormsModule,
    EducationalLevelsSelectComponent,
    FieldsSelectComponent,
    AcademicYearsSelectComponent,
    ButtonDirective,
    CheckboxComponent,
  ],
})
export class SchoolStudentsMainFiltersComponent {
  @Input() initialData: Partial<IGetSchoolStudentsRequestPayload> = {};
  @Output() onSubmit = new EventEmitter<IGetSchoolStudentsRequestPayload>();
  private fb = inject(FormBuilder);
  constructor() {}

  form = this.fb.group({
    academicYear: this.fb.control(this.initialData.academicYear || null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    educationalLevelId: this.fb.control(this.initialData.educationalLevelId || null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fieldOfStudyId: this.fb.control(this.initialData.fieldOfStudyId || null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    onlyInSchool: this.fb.control(this.initialData.onlyInSchool || false),
  });

  ngOnInit() {
    this.form.patchValue(this.initialData);
  }

  submit = () => {
    this.form.markAsTouched();
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value as IGetSchoolStudentsRequestPayload);
    }
  };
}
