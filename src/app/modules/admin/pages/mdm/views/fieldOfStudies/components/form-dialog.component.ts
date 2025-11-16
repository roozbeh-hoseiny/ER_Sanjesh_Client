import { ToastService } from '@/core/services/toast.service';
import { IFieldOfStudyRequestPayload } from '@/modules/admin/models';
import { AdminMDMService } from '@/modules/admin/services';
import { EducationalLevelsSelectComponent } from '@/shared/catalog';
import { InputComponent } from '@/shared/components';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { Component, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'field-form-dialog',
  templateUrl: './form-dialog.component.html',
  imports: [
    Dialog,
    ReactiveFormsModule,
    FormFooterActionsComponent,
    EducationalLevelsSelectComponent,
    InputComponent,
  ],
})
export class FieldFormDialogComponent {
  private fb = inject(FormBuilder);
  constructor(
    private service: AdminMDMService,
    private toastService: ToastService,
  ) {
    effect(() => {
      const v = this.visibleSignal();
      this.visibleChange.emit(v);
      if (!v) this.form.reset();
    });
  }

  @Input()
  set visible(v: boolean) {
    this.visibleSignal.set(!!v);
  }
  get visible() {
    return this.visibleSignal();
  }
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<void>();

  private visibleSignal = signal(false);
  submitLoading = signal(false);

  form = this.fb.group({
    title: new FormControl<string>('', [Validators.required]),
    educationalId: new FormControl<number>(0, [Validators.required]),
  });

  close() {
    this.visibleSignal.set(false);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.submitLoading.set(true);
    const payload = this.form.value as IFieldOfStudyRequestPayload;
    this.service.addFieldOfStudy(payload).subscribe({
      next: (_) => {
        this.submitLoading.set(false);
        this.toastService.success({ text: `رشته تحصیلی ${payload.title} با موفقیت اضافه شد.` });
        this.onSubmit.emit();
        this.form.reset();
        this.close();
      },
      error: (_) => {
        this.submitLoading.set(false);
      },
    });
    // this.onSubmit.emit();
  }
}
