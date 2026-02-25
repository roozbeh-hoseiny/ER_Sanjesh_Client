import { AbstractDialog } from '@/shared/abstractClasses/abstract-dialog';
import { UikitLabelComponent } from '@/uikit';
import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { RadioButton } from 'primeng/radiobutton';
import { SchoolExamStore } from '../../../dataStore';
import { TRegistrationTypes } from '../../../models/types';
import { SchoolExamRegistrationCouponComponent } from './registration-coupon.component';
import { SchoolExamRegistrationCreditComponent } from './registration-credit.component';
import { SchoolExamRegistrationPaymentComponent } from './registration-payment.component';

@Component({
  selector: 'school-exam-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  imports: [
    Dialog,
    RadioButton,
    UikitLabelComponent,
    ReactiveFormsModule,
    SchoolExamRegistrationPaymentComponent,
    SchoolExamRegistrationCouponComponent,
    SchoolExamRegistrationCreditComponent,
  ],
})
export class SchoolExamRegistrationDialogComponent extends AbstractDialog {
  @Input() selectedStudentIds!: string[];
  @Output() onRegistrationSuccess = new EventEmitter<void>();

  private readonly store = inject(SchoolExamStore);
  private readonly fb = inject(FormBuilder);

  selectedRegistrationTypeControl = this.fb.control<TRegistrationTypes>('payment', {
    nonNullable: true,
  });

  registrationTypes = signal<{ label: string; value: TRegistrationTypes }[]>([
    { label: 'پرداخت مستقیم', value: 'payment' },
  ]);

  submitLoading = signal(false);
  examInfo = computed(() => this.store.info());

  ngOnInit() {
    if (this.examInfo()?.canUseCoupon)
      this.registrationTypes.update((types) => [
        ...types,
        { label: 'استفاده از کوپن', value: 'coupon' },
      ]);
    if (this.examInfo()?.canUseCredit)
      this.registrationTypes.update((types) => [
        ...types,
        { label: 'استفاده از اعتبار', value: 'credit' },
      ]);
  }

  registrationSuccess() {
    this.close();
    this.onRegistrationSuccess.emit();
  }
  onRegistering(status: boolean) {
    this.submitLoading.set(status);
  }
}
