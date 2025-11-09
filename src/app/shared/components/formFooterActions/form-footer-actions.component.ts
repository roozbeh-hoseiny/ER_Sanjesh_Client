import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-form-footer-actions',
  templateUrl: './form-footer-actions.component.html',
  imports: [Button],
})
export class FormFooterActionsComponent {
  @Input() loading = false;
  @Output() onSubmit = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  constructor() {}

  submit() {
    this.onSubmit.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
