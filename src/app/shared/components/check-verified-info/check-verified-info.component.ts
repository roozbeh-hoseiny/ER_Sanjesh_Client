import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmPopup } from 'primeng/confirmpopup';

@Component({
  selector: 'app-check-verified-info',
  templateUrl: './check-verified-info.component.html',
  imports: [Button, ConfirmPopup],
  providers: [ConfirmationService],
})
export class CheckVerifiedInfoComponent {
  @Input() value?: string = '-';
  @Input() isVerified?: boolean = false;
  @Input() notVerifiedMessage?: string = 'اطلاعات تایید نشده است';
  @Input() toggleLoading?: boolean = false;
  @Input() inlineConfirmation: boolean = true;
  @Input() confirmationVerifyMessage: string = 'آیا از تایید این اطلاعات اطمینان دارید؟';
  @Input() confirmationUnVerifyMessage: string = 'آیا از رد این اطلاعات اطمینان دارید؟';
  @Output() onToggleVerify = new EventEmitter<boolean>();

  constructor(private confirmationService: ConfirmationService) {}

  toggle = () => {
    this.onToggleVerify.emit(!this.isVerified);
  };

  onClick($event: Event) {
    if (this.inlineConfirmation) {
      this.showConfirmation($event);
    } else {
      this.toggle();
    }
  }

  showConfirmation(event: Event) {
    this.confirmationService.confirm({
      target: (event.target as HTMLElement)?.parentNode?.parentNode!,
      message: this.isVerified ? this.confirmationUnVerifyMessage : this.confirmationVerifyMessage,
      header: 'تایید تغییر وضعیت',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'بله',
      rejectLabel: 'خیر',
      rejectButtonProps: {
        variant: 'outlined',
      },
      accept: () => this.toggle(),
    });
  }
}
