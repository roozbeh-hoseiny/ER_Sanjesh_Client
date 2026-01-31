import { AbstractFormDialog } from '@/shared/abstractClasses';
import { InputComponent } from '@/shared/components';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CreditsDialogLayoutComponent } from './dialog-layout.component';

interface ISubmitRequestPayload {
  id: string;
  value: string;
}

@Component({
  selector: 'credits-decrease-form-dialog',
  templateUrl: './decrease-form-dialog.component.html',
  imports: [ReactiveFormsModule, InputComponent, CreditsDialogLayoutComponent],
})
export class CreditsDecreaseFormDialogComponent extends AbstractFormDialog<
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
  override successMessage = 'کسر اعتبار با موفقیت انجام شد.';

  form = this.fb.group({
    value: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(this.currentValue)],
    }),
  });

  get newAmount() {
    return parseInt(this.currentValue + '') - parseInt((this.form.controls.value.value || 0) + '');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentValue']?.firstChange) {
      this.form.controls.value.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(this.currentValue),
      ]);
      this.form.controls.value.updateValueAndValidity({ emitEvent: false });
    }
  }

  override prepareRequestPayload(payload: any) {
    return { id: this.schoolId, value: payload.value + '' };
  }

  submitForm(payload: any): void | Observable<any> {
    return this.http.post(this.submitUrl, payload);
  }
}
