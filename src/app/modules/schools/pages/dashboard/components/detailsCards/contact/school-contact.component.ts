import { ISchoolContactRequest } from '@/modules/schools/models';
import { AppCardComponent, CheckVerifiedInfoComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { SchoolDetailsCardsStore } from '../store';
import { SchoolContactFormComponent } from './school-contact-form.component';

@Component({
  selector: 'app-school-contact',
  imports: [
    AppCardComponent,
    KeyValueComponent,
    SchoolContactFormComponent,
    CheckVerifiedInfoComponent,
  ],
  templateUrl: './school-contact.component.html',
})
export class SchoolContactComponent {
  @Output() onSubmit = new EventEmitter<ISchoolContactRequest>();
  @Output() onUpdateValidation = new EventEmitter<void>();

  private detailsStore = inject(SchoolDetailsCardsStore);

  readonly contact = computed(() => this.detailsStore.school()?.contactInfo);
  readonly canEdit = computed(() => this.detailsStore.canEditContact());
  readonly submitLoading = computed(() => this.detailsStore.submitContactLoading());
  readonly schoolId = computed(() => this.detailsStore.school()?.id);

  editMode = signal<boolean>(false);
  mobileToggleLoading = signal<boolean>(false);
  emailToggleLoading = signal<boolean>(false);

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  submitForm(payload: ISchoolContactRequest) {
    this.detailsStore.editContact(payload).subscribe({
      next: () => {
        this.onSubmit.emit(payload);
        this.closeForm();
      },
      error: () => {},
    });
  }

  toggleVerifyMobile(status: boolean) {
    this.mobileToggleLoading.set(true);
    const observable = this.detailsStore[
      status ? 'validateContactMobile' : 'invalidateContactMobile'
    ](this.schoolId()!);
    if (observable && typeof (observable as any).subscribe === 'function') {
      (observable as { subscribe: Function }).subscribe(() => {
        this.mobileToggleLoading.set(false);
        this.onUpdateValidation.emit();
      });
    }
  }

  toggleVerifyEmail(status: boolean) {
    this.emailToggleLoading.set(true);
    const observable = this.detailsStore[
      status ? 'validateContactEmail' : 'invalidateContactEmail'
    ](this.schoolId()!);
    if (observable && typeof (observable as any).subscribe === 'function') {
      (observable as { subscribe: Function }).subscribe(() => {
        this.emailToggleLoading.set(false);
        this.onUpdateValidation.emit();
      });
    }
  }
}
