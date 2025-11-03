import { ToastService } from '@/core/services/toast.service';
import { mobileValidator } from '@/core/validators/mobile.validator';
import { IContactInfo, ISchoolContactRequest } from '@/modules/schools/models';
import { SchoolsInfoService } from '@/modules/schools/services';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { SchoolPersonFormComponent } from './school-person-form.component';

@Component({
  selector: 'app-school-contact-form',
  templateUrl: './school-contact-form.component.html',
  imports: [SchoolPersonFormComponent, ReactiveFormsModule, ButtonDirective],
})
export class SchoolContactFormComponent {
  @Input() schoolId!: string;
  @Input() contact!: IContactInfo;
  @Input() loading: boolean = false;

  @Output() closeForm = new EventEmitter();
  @Output() submitForm = new EventEmitter<ISchoolContactRequest>();

  private fb = inject(FormBuilder);

  constructor(
    private readonly schoolService: SchoolsInfoService,
    private readonly toastService: ToastService,
  ) {}

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    mobile: ['', [Validators.required, mobileValidator()]],
    email: ['', [Validators.required, Validators.email]],
    gender: [true, [Validators.required]],
  });

  ngOnInit() {
    this.form.patchValue(this.contact);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const payload = { id: this.schoolId, ...this.form.value } as ISchoolContactRequest;
    this.submitForm.emit(payload);
  }

  close() {
    this.closeForm.emit();
  }
}
