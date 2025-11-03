import { ISchoolAddress } from '@/modules/schools/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { SchoolAddressFormComponent } from './school-address-form.component';

@Component({
  selector: 'app-school-address',
  imports: [AppCardComponent, KeyValueComponent, SchoolAddressFormComponent],
  templateUrl: './school-address.component.html',
})
export class SchoolAddress {
  @Input() address!: ISchoolAddress;
  @Input() schoolId!: string;
  @Input() canEdit: boolean = false;
  @Input() loading: boolean = false;

  @Output() onSubmitted = new EventEmitter<void>();

  editMode = signal<boolean>(false);

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  submitForm() {
    this.onSubmitted.emit();
    this.closeForm();
  }
}
