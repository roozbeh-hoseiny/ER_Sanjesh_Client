import { ISchoolContactRequest } from '@/modules/schools/models';
import { Component, EventEmitter, Output } from '@angular/core';
import { SchoolAddress } from './address/school-address.component';
import { SchoolContactComponent } from './contact/school-contact.component';
import { SchoolInfoComponent } from './info/school-info.component';
import { SchoolManagerComponent } from './school-login-info.component';
import { SchoolDetailsCardsStore } from './store';
import { TeachersSimpleListComponent } from './teachers/teachers-simple-list.component';

@Component({
  selector: 'school-details',
  templateUrl: './school-details.component.html',
  imports: [
    SchoolInfoComponent,
    SchoolAddress,
    SchoolManagerComponent,
    SchoolContactComponent,
    TeachersSimpleListComponent,
  ],
})
export class SchoolDetailsComponent {
  constructor(private detailsStore: SchoolDetailsCardsStore) {}

  @Output() onRefreshData = new EventEmitter<void>();
  @Output() onSubmitContact = new EventEmitter<ISchoolContactRequest>();

  get school() {
    return this.detailsStore.school();
  }

  get showTeachersCard() {
    return this.detailsStore.showTeachersCard();
  }

  get showContactCard() {
    return this.detailsStore.showContactCard();
  }

  get canEditInfo() {
    return this.detailsStore.canEditInfo();
  }

  get canEditAddress() {
    return this.detailsStore.canEditAddress();
  }

  get canEditContact() {
    return this.detailsStore.canEditContact();
  }

  get canEditLoginInfo() {
    return this.detailsStore.canEditLoginInfo();
  }

  get submitContactLoading() {
    return this.detailsStore.submitContactLoading();
  }

  refreshData() {
    this.onRefreshData.emit();
  }

  submitContact(payload: ISchoolContactRequest) {
    this.detailsStore.editContact(payload).subscribe({
      next: () => this.onSubmitContact.emit(payload),
      error: () => {},
    });
  }
}
