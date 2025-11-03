import { ISchoolAddress } from '@/modules/schools/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, Input, signal } from '@angular/core';
import { SchoolAddressFormComponent } from './school-address-form.component';

@Component({
  selector: 'app-school-address',
  imports: [AppCardComponent, KeyValueComponent, SchoolAddressFormComponent],
  templateUrl: './school-address.component.html',
})
export class SchoolAddress {
  @Input() address!: ISchoolAddress;
  @Input() schoolId!: string;

  editMode = signal<boolean>(false);

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }
}
