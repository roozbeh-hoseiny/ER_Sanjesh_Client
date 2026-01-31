import { ISchoolContactRequest } from '@/modules/schools/models';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SchoolAddress } from './address/school-address.component';
import { SchoolAgentComponent } from './agent';
import { SchoolInfoBankAccountsComponent } from './bankAccounts';
import { SchoolContactComponent } from './contact/school-contact.component';
import { SchoolInfoCreditsComponent } from './credits/credits.component';
import { SchoolInfoComponent } from './info/school-info.component';
import { SchoolLoginInfoComponent } from './loginInfo/login-info.component';
import { SchoolDetailsCardsStore } from './store';
import { TeachersSimpleListComponent } from './teachers/teachers-simple-list.component';

@Component({
  selector: 'school-details',
  templateUrl: './school-details.component.html',
  imports: [
    SchoolInfoComponent,
    SchoolAddress,
    SchoolContactComponent,
    TeachersSimpleListComponent,
    SchoolInfoBankAccountsComponent,
    SchoolAgentComponent,
    SchoolLoginInfoComponent,
    SchoolInfoCreditsComponent,
  ],
})
export class SchoolDetailsComponent {
  private readonly detailsStore = inject(SchoolDetailsCardsStore);
  constructor() {}

  @Output() onRefreshData = new EventEmitter<void>();
  @Output() onSubmitContact = new EventEmitter<ISchoolContactRequest>();

  readonly school = this.detailsStore.school;
  readonly showTeachersCard = this.detailsStore.showTeachersCard;
  readonly showBankAccountsCard = this.detailsStore.showBankAccountsCard;
  readonly showContactCard = this.detailsStore.showContactCard;
  readonly showAgentCard = this.detailsStore.showAgentCard;
  readonly canEditInfo = this.detailsStore.canEditInfo;
  readonly canEditAddress = this.detailsStore.canEditAddress;
  readonly canEditContact = this.detailsStore.canEditContact;
  readonly canEditLoginInfo = this.detailsStore.canEditLoginInfo;
  readonly submitContactLoading = this.detailsStore.submitContactLoading;
  readonly teachersLoading = this.detailsStore.submitContactLoading;

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
