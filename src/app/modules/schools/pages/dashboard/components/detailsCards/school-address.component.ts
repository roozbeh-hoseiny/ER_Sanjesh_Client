import { ISchoolAddress } from '@/modules/schools/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { SchoolAddressFormComponent } from './school-address-form.component';
import { SchoolDetailsCardsStore } from './store';

@Component({
  selector: 'app-school-address',
  imports: [AppCardComponent, KeyValueComponent, SchoolAddressFormComponent],
  templateUrl: './school-address.component.html',
})
export class SchoolAddress {
  private detailsStore = inject(SchoolDetailsCardsStore);

  @Output() onSubmitted = new EventEmitter<void>();

  editMode = signal<boolean>(false);

  get address() {
    return this.detailsStore.school()
      ? (this.detailsStore.school()!.address as ISchoolAddress)
      : null;
  }

  get schoolId() {
    return this.detailsStore.school() ? this.detailsStore.school()!.id : '';
  }

  get canEdit() {
    return this.detailsStore.canEditAddress();
  }

  get loading() {
    return this.detailsStore.submitContactLoading();
  }

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
