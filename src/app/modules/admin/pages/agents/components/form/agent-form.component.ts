import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { mobileValidator } from '@/core/validators/mobile.validator';
import { AdminAgentsService } from '@/modules/admin/services/admin-agents.service';
import { GenderSelectComponent } from '@/shared/catalog/gender/gender-select.component';
import { InputComponent } from '@/shared/components';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { SelectModule } from 'primeng/select';
import { IAdminAgentRequestPayload, IAdminAgentResponse } from '../../models';

@Component({
  selector: 'admin-agent-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    TextareaModule,
    DividerModule,
    SelectModule,
    GenderSelectComponent,
    FormFooterActionsComponent,
    InputComponent,
  ],
  templateUrl: './agent-form.component.html',
})
export class AdminAgentFormDialogComponent {
  private fb = inject(FormBuilder);

  // Validator that ensures at least one of mobile or email is filled in managerInfo

  @Input() visible = false;
  @Input() defaultValues?: Maybe<Partial<IAdminAgentResponse>>;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<IAdminAgentRequestPayload>();

  constructor(
    private service: AdminAgentsService,
    private toastService: ToastService,
  ) {}

  onSubmitLoading = signal<boolean>(false);

  form = this.fb.group({
    firstName: [this.defaultValues?.firstName || '', [Validators.required]],
    lastName: [this.defaultValues?.lastName || '', [Validators.required]],
    gender: [this.defaultValues?.gender || false, [Validators.required]],
    mobile: [this.defaultValues?.mobile || '', [Validators.required, mobileValidator()]],
    email: [this.defaultValues?.email || '', [Validators.required, Validators.email]],
  });

  editMode = computed(() => Boolean(this.defaultValues));

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.applyDefaultValues();
    }
  }

  private applyDefaultValues() {
    if (this.defaultValues) {
      // patch nested groups safely
      this.form.patchValue(this.defaultValues);
    } else {
      this.form.reset();
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  close() {
    this.form.reset();
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.onSubmitLoading.set(true);
    const payload = this.form.value as IAdminAgentRequestPayload;
    this.service[this.editMode() ? 'update' : 'add']({
      ...payload,
      id: this.defaultValues?.id!,
    }).subscribe({
      next: () => {
        this.toastService.success({
          text: `بازاریاب ${payload.firstName} ${payload.lastName} با موفقیت ${this.editMode() ? 'ویرایش' : 'اضافه'} شد.`,
        });
        this.save.emit(payload);
        this.close();
        this.onSubmitLoading.set(false);
      },
      error: () => {
        this.onSubmitLoading.set(false);
      },
    });
  }
}
