import { ToastService } from '@/core/services/toast.service';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize, Observable } from 'rxjs';

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
  showSuccessMessage: boolean = false;
  successMessage = 'عملیات با موفقیت انجام شد';
  defaultValues: Partial<Request> = {};

  abstract submitForm(payload: Request): Observable<Response> | void;

  submitLoading = signal(false);

  submit() {
    console.log('submit');

    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.form.disable();
      this.submitLoading.set(true);

      this.submitForm(this.form.value as Request)
        ?.pipe(
          finalize(() => {
            this.submitLoading.set(false);
            this.form.enable();
          }),
        )
        .subscribe((res) => {
          if (this.showSuccessMessage) {
            this.toastService.success({
              text: this.successMessage,
            });
          }
          this.form.reset();
          this.onSubmit.emit(res);
        });
    }
  }

  close() {
    this.onClose.emit();
  }
}
