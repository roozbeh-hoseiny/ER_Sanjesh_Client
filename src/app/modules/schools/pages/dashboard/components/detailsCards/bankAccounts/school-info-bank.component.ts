import { Maybe } from '@/core';
import { ISchoolBankInfo } from '@/modules/schools/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { UikitEmptyStateComponent } from '@/uikit';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { SchoolDetailsCardsStore } from '../store';
import { SchoolBankFormDialogComponent } from './school-bank-form-dialog.component';

@Component({
  selector: 'app-school-info-bank-accounts',
  templateUrl: './school-info-bank.component.html',
  imports: [
    AppCardComponent,
    KeyValueComponent,
    Divider,
    ButtonDirective,
    SchoolBankFormDialogComponent,
    UikitEmptyStateComponent,
  ],
})
export class SchoolInfoBankAccountsComponent {
  @Output() onSubmit = new EventEmitter<void>();

  private detailsStore = inject(SchoolDetailsCardsStore);

  get bankAccounts() {
    return this.detailsStore.school() ? this.detailsStore.school()!.bankAccounts : null;
  }
  get canEdit() {
    return this.detailsStore.canEditBankAccounts();
  }

  get schoolId() {
    return this.detailsStore.school()?.id;
  }

  showForm = signal<boolean>(false);
  removeLoading = signal<boolean>(false);
  selectedBankAccountForEdit = signal<Maybe<ISchoolBankInfo>>(null);

  onEdit(item: ISchoolBankInfo) {
    this.selectedBankAccountForEdit.set(item);
    this.showForm.update((prev) => !prev);
  }

  onRemove(item: ISchoolBankInfo) {
    this.removeLoading.set(true);
    this.detailsStore
      .removeBankInfo({
        id: this.schoolId!,
        bankAccountId: item.id,
      })
      .subscribe({
        next: () => {
          this.removeLoading.set(false);
          this.onSubmit.emit();
        },
        error: () => {
          this.removeLoading.set(false);
        },
      });
  }

  closeForm() {
    this.selectedBankAccountForEdit.set(null);
    this.showForm.set(false);
  }

  onAdd() {
    this.showForm.set(true);
  }

  submitForm() {
    this.selectedBankAccountForEdit.set(null);
    this.onSubmit.emit();
  }
}
