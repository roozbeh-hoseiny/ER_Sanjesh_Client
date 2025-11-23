import { ToastService } from '@/core/services/toast.service';
import { AdminExamsService } from '@/modules/admin/services';
import { LessonsSelectComponent } from '@/shared/catalog';
import { InputComponent } from '@/shared/components';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { Component, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { PriceMaskDirective } from '@/shared/directives/price-mask.directive';
import { UikitDurationPickerComponent } from "@/uikit";
import { UikitFlatpickrJalaliComponent } from '@/uikit/datepicker/datepicker.component';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Dialog } from 'primeng/dialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { IExamRequestPayload } from '../../models';

@Component({
  selector: 'exam-form-dialog',
  templateUrl: './form-dialog.component.html',
  standalone: true,
  imports: [
    Dialog,
    InputComponent,
    FormFooterActionsComponent,
    LessonsSelectComponent,
    UikitFlatpickrJalaliComponent,
    ReactiveFormsModule,
    InputNumber,
    PriceMaskDirective,
    UikitFieldComponent,
    InputText,
    InputGroupAddon,
    InputGroup,
    UikitDurationPickerComponent
],
})
export class ExamFormDialogComponent {
  constructor(
    private service: AdminExamsService,
    private toastService: ToastService,
  ) {
    effect(() => {
      const v = this.visibleSignal();
      // this.visibleChange.emit(v);
      if (!v) this.form.reset();
    });
  }

  private fb = inject(FormBuilder);

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
    lessonId: new FormControl<number>(0, [Validators.required]),
    examTime: new FormControl<string>('', [Validators.required]),
    registrationStartTime: new FormControl<string>('', [Validators.required]),
    registrationEndTime: new FormControl<string>('', [Validators.required]),
    duration: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
    price: new FormControl<string>('', [Validators.required]),
    score: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(1000),
    ]),
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
    const payload = this.form.value as IExamRequestPayload;
    this.service.create(payload).subscribe({
      next: (_) => {
        this.submitLoading.set(false);
        this.toastService.success({ text: `آزمون ${payload.title} با موفقیت اضافه شد.` });
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
