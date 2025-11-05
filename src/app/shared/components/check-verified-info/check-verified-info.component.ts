import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-check-verified-info',
  templateUrl: './check-verified-info.component.html',
  imports: [Button],
})
export class CheckVerifiedInfoComponent {
  @Input() value?: string = '-';
  @Input() isVerified?: boolean = false;
  @Input() notVerifiedMessage?: string = 'اطلاعات تایید نشده است';
  @Output() onVerify = new EventEmitter<void>();

  constructor() {}

  onClick = () => {
    this.onVerify.emit();
  };
}
