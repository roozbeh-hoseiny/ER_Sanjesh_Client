import { ISchoolContactRequest, ISchoolResponse } from '@/modules/schools/models';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { SchoolAddress } from './school-address.component';
import { SchoolContactComponent } from './school-contact.component';
import { SchoolInfoComponent } from './school-info.component';
import { SchoolManagerComponent } from './school-login-info.component';

@Component({
  selector: 'school-details',
  templateUrl: './school-details.component.html',
  imports: [SchoolInfoComponent, SchoolAddress, SchoolManagerComponent, SchoolContactComponent],
})
export class SchoolDetailsComponent {
  @Input() school!: ISchoolResponse;
  @Input() canEditInfo: boolean = false;
  @Input() canEditAddress: boolean = false;
  @Input() canEditContact: boolean = false;
  @Input() canEditLoginInfo: boolean = false;
  @Input() submitContactLoading: boolean = false;

  @Output() onRefreshData = new EventEmitter<void>();
  @Output() onSubmitContact = new EventEmitter<ISchoolContactRequest>();

  schoolId = signal<string>('');

  constructor() {}

  ngOnInit() {
    this.schoolId.set(this.school.id);
  }

  refreshData() {
    this.onRefreshData.emit();
  }

  submitContact(payload: ISchoolContactRequest) {
    this.onSubmitContact.emit(payload);
  }
}
