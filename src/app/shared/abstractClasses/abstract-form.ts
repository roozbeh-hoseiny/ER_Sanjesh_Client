import { ToastService } from '@/core/services/toast.service';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscribable } from 'rxjs';

@Component({
  selector: 'abstract-form-dialog',
  template: '',
  imports: [ReactiveFormsModule],
})
export abstract class AbstractForm<Request, Response, InitialValue = Response> {
  @Input() initialValues?: InitialValue;

  @Output() onSubmit = new EventEmitter<Response>();
  @Output() onClose = new EventEmitter<void>();

  protected readonly fb = inject(FormBuilder);
  constructor(private toastService: ToastService) {}

  abstract form: ReturnType<FormBuilder['group']>;
  defaultValues: Partial<Request> = {};

  abstract submitForm(payload: Request): Subscribable<Response> | void;

  submitLoading = signal(false);

  submit() {
    this.form.markAllAsTouched();
    console.log(this.form);
    console.log(this.form.value);

    if (this.form.valid) {
      this.form.disable();
      this.submitLoading.set(true);

      this.submitForm(this.form.value as Request)?.subscribe({
        next: (res) => {
          this.toastService.success({
            text: `با موفقیت ایجاد شد`,
          });
          this.submitLoading.set(false);
          this.form.enable();
          this.form.reset();
          this.onSubmit.emit(res);
        },
        error: () => {
          this.submitLoading.set(false);
          this.form.enable();
        },
        complete: () => {
          this.submitLoading.set(false);
          this.form.enable();
        },
      });
    }
  }

  close() {
    this.onClose.emit();
  }
}
