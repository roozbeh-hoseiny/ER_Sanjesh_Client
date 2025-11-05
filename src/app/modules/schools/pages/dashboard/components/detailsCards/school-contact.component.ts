import { IContactInfo, ISchoolContactRequest } from '@/modules/schools/models';
import { AppCardComponent, CheckVerifiedInfoComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { SchoolContactFormComponent } from './school-contact-form.component';
import { SchoolDetailsCardsStore } from './store';

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

  private detailsStore = inject(SchoolDetailsCardsStore);

  get contact() {
    return this.detailsStore.school()
      ? (this.detailsStore.school()!.contactInfo as IContactInfo)
      : null;
  }
  get canEdit() {
    return this.detailsStore.canEditContact();
  }
  get submitLoading() {
    return this.detailsStore.submitContactLoading();
  }

  editMode = signal<boolean>(false);

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  submitForm(payload: ISchoolContactRequest) {
    // delegate to store
    this.detailsStore.editContact(payload).subscribe({
      next: () => {
        this.onSubmit.emit(payload);
        this.closeForm();
      },
      error: () => {},
    });
  }
}
