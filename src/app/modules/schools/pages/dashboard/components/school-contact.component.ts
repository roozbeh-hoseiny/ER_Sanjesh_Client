import { IContactInfo, ISchoolContactRequest } from '@/modules/schools/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { SchoolContactFormComponent } from './school-contact-form.component';

@Component({
  selector: 'school-contact',
  imports: [AppCardComponent, KeyValueComponent, Button, SchoolContactFormComponent],
  templateUrl: './school-contact.component.html',
})
export class SchoolContactComponent {
  @Input() contact!: IContactInfo;
  @Input() canEdit: boolean = false;
  @Input() submitLoading: boolean = false;

  @Output() onSubmit = new EventEmitter<ISchoolContactRequest>();

  editMode = signal<boolean>(false);

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  submitForm(payload: ISchoolContactRequest) {
    this.onSubmit.emit(payload);
    this.closeForm();
  }
}
