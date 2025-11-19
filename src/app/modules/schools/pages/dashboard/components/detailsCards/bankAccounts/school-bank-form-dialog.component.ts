import { ISchoolBankInfo, ISchoolBankInfoEditRequestPayload } from '@/modules/schools/models';
import { BankSelectComponent } from '@/shared/catalog/banks';
import { InputComponent } from '@/shared/components';
import { Component, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { SchoolDetailsCardsStore } from '../store';

@Component({
  selector: 'app-school-bank-form-dialog',
  templateUrl: './school-bank-form-dialog.component.html',
  imports: [ReactiveFormsModule, ButtonDirective, InputComponent, BankSelectComponent, Dialog],
})
export class SchoolBankFormDialogComponent {
  @Input() defaultValues?: ISchoolBankInfo;
  @Output() closeForm = new EventEmitter();
  @Output() submitForm = new EventEmitter<ISchoolBankInfoEditRequestPayload>();

  @Input()
  set visible(v: boolean) {
    this.visibleSignal.set(!!v);
  }
  get visible() {
    return this.visibleSignal();
  }
  @Output() visibleChange = new EventEmitter<boolean>();

  private visibleSignal = signal(false);

  private fb = inject(FormBuilder);

  private detailsStore = inject(SchoolDetailsCardsStore);

  constructor() {
    effect(() => {
      const v = this.visibleSignal();

      if (!v) {
        this.form.reset();
        return;
      }

      if (this.defaultValues) {
        Promise.resolve().then(() => {
          if (this.visibleSignal()) {
            this.form.patchValue(this.defaultValues as any);
          }
        });
      }
    });
  }

  form = this.fb.group({
    bankTypeId: [this.defaultValues?.bankTypeId ?? 0, [Validators.required]],
    branchCode: ['', [Validators.required]],
    branchName: ['', [Validators.required]],
    ownerName: ['', [Validators.required]],
    depositeNumber: ['', [Validators.required]],
    sheba: ['', [Validators.required]],
  });

  submitLoading = signal<boolean>(false);

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;
    this.submitLoading.set(true);
    const payload = {
      ...(this.form.value as ISchoolBankInfoEditRequestPayload),
      id: this.detailsStore.school()!.id,
    };
    if (this.defaultValues) {
      this.detailsStore
        .editBankInfo({ ...payload, bankAccountId: this.defaultValues?.id! })
        .subscribe({
          next: () => {
            this.submitForm.emit(payload);
            this.submitLoading.set(false);
            this.close();
          },
          error: () => {
            this.submitLoading.set(false);
            this.close();
          },
        });
    } else {
      this.detailsStore.addBankInfo(payload).subscribe({
        next: () => {
          this.submitForm.emit(payload);
          this.submitLoading.set(false);
          this.close();
        },
        error: () => {
          this.submitLoading.set(false);
          this.close();
        },
      });
    }
  }

  close() {
    this.closeForm.emit();
  }
}
