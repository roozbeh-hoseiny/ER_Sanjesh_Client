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
  selector: 'credits-edit-form-dialog',
  templateUrl: './edit-form-dialog.component.html',
  imports: [ReactiveFormsModule, InputComponent, CreditsDialogLayoutComponent],
})
export class CreditsEditFormDialogComponent extends AbstractFormDialog<
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
  override successMessage = 'ویرایش اعتبار با موفقیت انجام شد.';

  form = this.fb.group({
    value: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  dialogHeader = computed(() => `ویرایش ${this.label}`);

  override prepareRequestPayload(payload: any) {
    return { id: this.schoolId, value: payload.value + '' };
  }

  submitForm(payload: any): void | Observable<any> {
    return this.http.post(this.submitUrl, payload);
  }
}
