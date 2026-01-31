import { InlineConfirmationComponent, KeyValueComponent } from '@/shared/components';
import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { SchoolDetailsCardsStore } from '../../store';
import { CreditsActionCtaComponent } from '../shared/action-cta.component';

@Component({
  selector: 'school-credit-info',
  templateUrl: './info.component.html',
  imports: [KeyValueComponent, CreditsActionCtaComponent, InlineConfirmationComponent],
})
export class SchoolCreditInfoComponent {
  @Output() onSubmitted = new EventEmitter<void>();

  private readonly store = inject(SchoolDetailsCardsStore);

  canEditStatus = computed(() => this.store.canEditCreditStatus());
  canEdit = computed(() => this.store.canEditCredit());
  remainedCredit = computed(() => this.store.school()?.remainedCredit || 0);

  canBuyExamByCredit = computed(() => this.store.school()?.canBuyExamByCredit);
  schoolId = computed(() => this.store.school()?.id);

  increaseCreditSubmitUrl = computed(() => this.store.increaseCreditSubmitUrl());
  decreaseCreditSubmitUrl = computed(() => this.store.decreaseCreditSubmitUrl());
  editCreditSubmitUrl = computed(() => this.store.editCreditSubmitUrl());

  updateCanEdit(status: boolean) {
    this.store.updateCanPurchaseByCredit(this.schoolId()!, status).subscribe(() => {
      this.onSubmitted.emit();
    });
  }

  refresh() {
    this.onSubmitted.emit();
  }
}
