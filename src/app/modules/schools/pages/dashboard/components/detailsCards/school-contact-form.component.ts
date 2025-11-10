import { mobileValidator } from '@/core/validators/mobile.validator';
import { IContactInfo, ISchoolContactRequest } from '@/modules/schools/models';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { SchoolPersonFormComponent } from './school-person-form.component';
import { SchoolDetailsCardsStore } from './store';

@Component({
  selector: 'app-school-contact-form',
  templateUrl: './school-contact-form.component.html',
  imports: [SchoolPersonFormComponent, ReactiveFormsModule, ButtonDirective],
})
export class SchoolContactFormComponent {
  @Output() closeForm = new EventEmitter();
  @Output() submitForm = new EventEmitter<ISchoolContactRequest>();

  private fb = inject(FormBuilder);

  private detailsStore = inject(SchoolDetailsCardsStore);

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    mobile: ['', [Validators.required, mobileValidator()]],
    email: ['', [Validators.required, Validators.email]],
    gender: [true, [Validators.required]],
  });

  submitLoading = signal<boolean>(false);

  ngOnInit() {
    const cur = this.detailsStore.school();
    if (cur && cur.contactInfo) {
      this.form.patchValue(cur.contactInfo as IContactInfo);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.submitLoading.set(true);
    const payload = {
      ...(this.form.value as ISchoolContactRequest),
      id: this.detailsStore.school()!.id,
    };
    this.detailsStore.editContact(payload).subscribe({
      next: () => {
        this.submitForm.emit(payload);
        this.submitLoading.set(false);
      },
      error: () => {
        this.submitLoading.set(false);
      },
    });
  }

  close() {
    this.closeForm.emit();
  }
}
