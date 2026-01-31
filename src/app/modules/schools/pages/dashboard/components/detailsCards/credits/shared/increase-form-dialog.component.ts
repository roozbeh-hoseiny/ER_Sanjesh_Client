import { AbstractFormDialog } from '@/shared/abstractClasses';
import { InputComponent } from '@/shared/components';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, Input } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CreditsDialogLayoutComponent } from './dialog-layout.component';

interface ISubmitRequestPayload {
  id: string;
  value: string;
}

@Component({
  selector: 'credits-increase-form-dialog',
  templateUrl: './increase-form-dialog.component.html',
  imports: [ReactiveFormsModule, InputComponent, CreditsDialogLayoutComponent],
})
export class CreditsIncreaseFormDialogComponent extends AbstractFormDialog<
  ISubmitRequestPayload,
  boolean
> {
  @Input() schoolId!: string;
  @Input() submitUrl!: string;
  @Input() label!: string;
  @Input() currentValue!: number;
  @Input() type!: 'number' | 'price';

  private readonly http = inject(HttpClient);

  override showSuccessMessage = true;
  override successMessage = 'افزایش اعتبار با موفقیت انجام شد.';

  form = this.fb.group({
    value: this.fb.control(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  dialogHeader = computed(() => `افزایش ${this.label}`);
  afterChangeText = computed(() => ``);

  get newAmount() {
    return parseInt(this.currentValue + '') + parseInt(this.form.controls.value.value + '');
  }

  override prepareRequestPayload(payload: any) {
    return { id: this.schoolId, value: payload.value + '' };
  }

  submitForm(payload: any): void | Observable<any> {
    return this.http.post(this.submitUrl, payload);
  }
}
