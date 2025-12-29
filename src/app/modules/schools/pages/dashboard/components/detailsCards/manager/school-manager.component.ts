import { ISchoolManagerInfo } from '@/modules/schools/models';
import { AppCardComponent, CheckVerifiedInfoComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { SchoolDetailsCardsStore } from '../store';
import { SchoolManagerFormComponent } from './school-manager-form.component';

@Component({
  selector: 'app-school-manager',
  imports: [
    AppCardComponent,
    KeyValueComponent,
    SchoolManagerFormComponent,
    CheckVerifiedInfoComponent,
  ],
  templateUrl: './school-manager.component.html',
})
export class SchoolManagerComponent {
  @Output() onSubmitted = new EventEmitter<void>();

  private detailsStore = inject(SchoolDetailsCardsStore);

  get managerInfo() {
    return this.detailsStore.school()
      ? (this.detailsStore.school()!.managerInfo as ISchoolManagerInfo)
      : null;
  }
  get schoolId() {
    return this.detailsStore.school()!.id;
  }
  get canEdit() {
    return this.detailsStore.canEditInfo();
  }

  get showInlineConfirmation() {
    return this.detailsStore.showManagerValidateInlineConfirmation();
  }

  editMode = signal<boolean>(false);

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  toggleVerifyMobile(status: boolean) {
    const observable = this.detailsStore[
      status ? 'validateManagerMobile' : 'invalidateManagerMobile'
    ](this.schoolId);
    if (observable && typeof (observable as any).subscribe === 'function') {
      (observable as { subscribe: Function }).subscribe(() => {
        this.onSubmitted.emit();
      });
    }
  }

  toggleVerifyEmail(status: boolean) {
    const observable = this.detailsStore[
      status ? 'validateManagerEmail' : 'invalidateManagerEmail'
    ](this.schoolId);
    if (observable && typeof (observable as any).subscribe === 'function') {
      (observable as { subscribe: Function }).subscribe(() => {
        this.onSubmitted.emit();
      });
    }
  }

  submitForm() {
    this.onSubmitted.emit();
    this.closeForm();
  }
}
