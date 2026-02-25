import { Component, signal } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'school-exam-registration-payment',
  templateUrl: './registration-payment.component.html',
  imports: [Card],
})
export class SchoolExamRegistrationPaymentComponent {
  constructor() {}

  selectedBank = signal(1);

  banks = [
    {
      name: 'بانک ملت',
      id: 1,
    },
    {
      name: 'بانک ملی',
      id: 2,
    },
    {
      name: 'بانک سامان',
      id: 3,
    },
  ];

  onSelectBank(bankId: number): void {
    this.selectedBank.set(bankId);
  }
}
