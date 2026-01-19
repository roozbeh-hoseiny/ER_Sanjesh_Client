import { ISchoolManagerInfo } from '@/modules/schools/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { SchoolDetailsCardsStore } from '../store';
import { SchoolLoginInfoFormComponent } from './login-info-form.component';

@Component({
  selector: 'app-school-login-info',
  imports: [AppCardComponent, KeyValueComponent, SchoolLoginInfoFormComponent],
  templateUrl: './login-info.component.html',
})
export class SchoolLoginInfoComponent {
  @Output() onSubmit = new EventEmitter();
  private detailsStore = inject(SchoolDetailsCardsStore);

  editMode = signal<boolean>(false);

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  manager = computed(() => {
    return this.detailsStore.school()
      ? (this.detailsStore.school()!.managerInfo as ISchoolManagerInfo)
      : null;
  });
  username = computed(() => {
    return this.detailsStore.school() ? this.detailsStore.school()!.username : null;
  });

  canEdit = computed(() => {
    return this.detailsStore.canEditLoginInfo();
  });

  submitted() {
    this.onSubmit.emit();
    this.closeForm();
  }
}
