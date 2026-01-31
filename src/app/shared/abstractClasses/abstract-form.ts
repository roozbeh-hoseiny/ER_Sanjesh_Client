import { ToastService } from '@/core/services/toast.service';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'abstract-form-dialog',
  template: '',
  imports: [ReactiveFormsModule],
})
export abstract class AbstractForm<
  FormInterface,
  Response,
  InitialValue = Response,
  RequestPayload extends FormInterface = FormInterface,
> {
  @Input() initialValues?: InitialValue;

  @Output() onSubmit = new EventEmitter<Response>();
  @Output() onClose = new EventEmitter<void>();

  protected readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  constructor() {}

  abstract form: ReturnType<FormBuilder['group']>;
  showSuccessMessage: boolean = false;
  successMessage = 'عملیات با موفقیت انجام شد';
  defaultValues: Partial<FormInterface> = {};

  abstract submitForm(payload: FormInterface): Observable<Response> | void;

  prepareRequestPayload(payload: FormInterface): RequestPayload {
    // @ts-ignore
    return payload;
  }

  onSuccess(response: Response): void {}

  submitLoading = signal(false);

  submit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      // this.form.disable();
      this.submitLoading.set(true);

      this.submitForm(this.prepareRequestPayload(this.form.value))
        ?.pipe(
          finalize(() => {
            this.submitLoading.set(false);
            // this.form.enable();
          }),
        )
        .subscribe((res) => {
          this.onSuccess(res);
          if (this.showSuccessMessage) {
            this.toastService.success({
              text: this.successMessage,
            });
          }
          this.onSubmit.emit(res);
          // this.form.reset();
        });
    }
  }

  close() {
    this.onClose.emit();
  }
}
