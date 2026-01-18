import { ToastService } from '@/core/services/toast.service';
import { Component, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractForm } from './abstract-form';

@Component({
  selector: 'abstract-form-dialog',
  template: '',
  imports: [ReactiveFormsModule],
})
export abstract class AbstractFormDialog<Request, Response> extends AbstractForm<
  Request,
  Response
> {
  @Input()
  set visible(v: boolean) {
    this.visibleSignal.set(!!v);
    this.visibleChange.emit(!!v);
  }
  get visible() {
    return this.visibleSignal();
  }
  private visibleSignal = signal(false);

  @Output() visibleChange = new EventEmitter<boolean>();

  constructor() {
    super(inject(ToastService));
    effect(() => {
      const v = this.visibleSignal();
      if (!v) this.form.reset(this.defaultValues);
    });
    this.submit.bind(() => {
      this.close();
    });
  }

  override close() {
    this.onClose.emit();
    this.visibleSignal.set(false);
  }
}
