import { AbstractDialog } from '@/shared/abstractClasses/abstract-dialog';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { PriceMaskDirective } from '@/shared/directives';
import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'credits-dialog-layout',
  templateUrl: './dialog-layout.component.html',
  imports: [Dialog, PriceMaskDirective, FormFooterActionsComponent],
})
export class CreditsDialogLayoutComponent extends AbstractDialog {
  @Input() label!: string;
  @Input() loading: boolean = false;
  @Input() newAmount: number = 0;
  @Input() variant!: 'increase' | 'decrease' | 'edit';

  @Output() onClose = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<any>();

  preparedLabel = computed(() =>
    this.variant === 'increase' ? 'افزایش' : this.variant === 'decrease' ? 'کاهش' : 'ویرایش',
  );
  dialogHeader = computed(() => `${this.preparedLabel()} ${this.label}`);
  showChangeText = computed(() => this.variant !== 'edit');

  close() {
    this.onClose.emit();
  }

  submit() {
    this.onSubmit.emit();
  }
}
