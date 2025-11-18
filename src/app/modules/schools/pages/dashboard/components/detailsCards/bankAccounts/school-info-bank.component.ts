import { ISchoolContactRequest } from '@/modules/schools/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Divider } from 'primeng/divider';
import { SchoolDetailsCardsStore } from '../store';
import { SchoolBankFormComponent } from './school-bank-form.component';

@Component({
  selector: 'app-school-info-bank-accounts',
  templateUrl: './school-info-bank.component.html',
  imports: [AppCardComponent, KeyValueComponent, SchoolBankFormComponent, Divider],
})
export class SchoolInfoBankAccountsComponent {
  @Output() onSubmit = new EventEmitter<ISchoolContactRequest>();

  private detailsStore = inject(SchoolDetailsCardsStore);

  get bankAccounts() {
    return this.detailsStore.school() ? this.detailsStore.school()!.bankAccounts : null;
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
