import {
  AcademicYearsSelectComponent,
  EducationalLevelsSelectComponent,
  FieldsSelectComponent,
} from '@/shared/catalog';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { IGetSchoolStudentsRequestPayload } from '../../models';

@Component({
  selector: 'school-students-main-filters',
  templateUrl: './main-filters.component.html',
  imports: [
    ReactiveFormsModule,
    EducationalLevelsSelectComponent,
    FieldsSelectComponent,
    AcademicYearsSelectComponent,
    ButtonDirective,
  ],
})
export class SchoolStudentsMainFiltersComponent {
  @Input() initialData: Partial<IGetSchoolStudentsRequestPayload> = {};
  @Output() onSubmit = new EventEmitter<IGetSchoolStudentsRequestPayload>();
  private fb = inject(FormBuilder);
  constructor() {}

  form = this.fb.group({
    academicYear: [this.initialData.academicYear ?? null, Validators.required],
    educationalLevelId: [this.initialData.educationalLevelId ?? null, Validators.required],
    fieldOfStudyId: [this.initialData.fieldOfStudyId ?? null, Validators.required],
  });

  submit = () => {
    this.form.markAsTouched();
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value as IGetSchoolStudentsRequestPayload);
    }
  };
}
