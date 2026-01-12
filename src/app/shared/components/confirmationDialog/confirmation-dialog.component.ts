import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-shared-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  providers: [ConfirmationService],
  imports: [ConfirmDialog, Button],
})
export class ConfirmationDialogComponent implements OnDestroy {
  @Input() message!: string;
  @Input() header: string = 'تأیید عملیات';
  @Input() acceptLabel: string = 'بله';
  @Input() rejectLabel: string = 'خیر';
  @Input() variant?: 'confirm' | 'reject' | 'info' = 'confirm';
  @Output() onAccept = new EventEmitter<void>();
  @Output() onReject = new EventEmitter<void>();

  constructor(private confirmationService: ConfirmationService) {}

  show() {
    this.confirmationService.confirm({
      header: this.header,
      message: this.message,
      acceptLabel: this.acceptLabel,
      rejectLabel: this.rejectLabel,
      accept: () => {
        this.accept();
      },
      reject: () => {
        this.reject();
      },
    });
  }

  accept() {
    this.onAccept.emit();
  }

  reject() {
    this.onReject.emit();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
}
