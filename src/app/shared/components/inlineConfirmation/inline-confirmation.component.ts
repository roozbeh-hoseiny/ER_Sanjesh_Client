import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { ConfirmPopup } from 'primeng/confirmpopup';

@Component({
  selector: 'inline-confirmation',
  templateUrl: './inline-confirmation.component.html',
  imports: [ConfirmPopup, Badge],
  providers: [ConfirmationService],
})
export class InlineConfirmationComponent {
  @Input() value!: boolean;
  @Input() confirmedMessage?: string = 'اطلاعات تایید شده است';
  @Input() rejectedMessage?: string = 'اطلاعات تایید نشده است';
  @Input() loading?: boolean = false;
  @Input() onConfirmMessage: string = 'آیا از تایید این اطلاعات اطمینان دارید؟';
  @Input() onRejectMessage: string = 'آیا از رد این اطلاعات اطمینان دارید؟';
  @Input() confirmationHeader: string = 'تایید تغییر وضعیت';
  @Input() confirmationIcon: string = 'pi pi-exclamation-triangle';
  @Input() acceptCTALabel: string = 'بله';
  @Input() rejectCTALabel: string = 'خیر';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onReject = new EventEmitter<void>();

  constructor(private confirmationService: ConfirmationService) {}

  toggle = () => {
    if (this.value) {
      this.onReject.emit();
    } else {
      this.onConfirm.emit();
    }
  };

  onClick($event: Event) {
    this.showConfirmation($event);
  }

  showConfirmation(event: Event) {
    this.confirmationService.confirm({
      target: (event.target as HTMLElement)?.parentNode?.parentNode!,
      message: this.value ? this.onRejectMessage : this.onConfirmMessage,
      header: this.confirmationHeader,
      icon: this.confirmationIcon,
      acceptLabel: this.acceptCTALabel,
      rejectLabel: this.rejectCTALabel,
      rejectButtonProps: {
        variant: 'outlined',
      },
      accept: () => this.toggle(),
    });
  }
}
