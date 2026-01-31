import { AppCardComponent } from '@/shared/components';
import { Component, EventEmitter, Output } from '@angular/core';
import { SchoolCouponInfoComponent } from './coupon/info.component';
import { SchoolCreditInfoComponent } from './credit/info.component';

@Component({
  selector: 'school-info-credits',
  templateUrl: './credits.component.html',
  imports: [AppCardComponent, SchoolCreditInfoComponent, SchoolCouponInfoComponent],
})
export class SchoolInfoCreditsComponent {
  @Output() onSubmitted = new EventEmitter<void>();

  submitted() {
    this.onSubmitted.emit();
  }
}
