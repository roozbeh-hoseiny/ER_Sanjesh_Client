import { InlineConfirmationComponent, KeyValueComponent } from '@/shared/components';
import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { SchoolDetailsCardsStore } from '../../store';
import { CreditsActionCtaComponent } from '../shared/action-cta.component';

@Component({
  selector: 'school-coupon-info',
  templateUrl: './info.component.html',
  imports: [KeyValueComponent, CreditsActionCtaComponent, InlineConfirmationComponent],
})
export class SchoolCouponInfoComponent {
  @Output() onSubmitted = new EventEmitter<void>();

  private readonly store = inject(SchoolDetailsCardsStore);

  canEditStatus = computed(() => this.store.canEditCouponStatus());
  canEdit = computed(() => this.store.canEditCoupon());
  remainedCoupon = computed(() => this.store.school()?.remainedCoupon || 0);

  canBuyExamByCoupon = computed(() => this.store.school()?.canBuyExamByCoupon);
  schoolId = computed(() => this.store.school()?.id);

  increaseCouponSubmitUrl = computed(() => this.store.increaseCouponSubmitUrl());
  decreaseCouponSubmitUrl = computed(() => this.store.decreaseCouponSubmitUrl());
  editCouponSubmitUrl = computed(() => this.store.editCouponSubmitUrl());

  updateCanEdit(status: boolean) {
    this.store.updateCanPurchaseByCoupon(this.schoolId()!, status).subscribe(() => {
      this.onSubmitted.emit();
    });
  }

  refresh() {
    this.onSubmitted.emit();
  }
}
