import { password } from '@/core/validators/password.validator';
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
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { mobileValidator } from '@/core/validators/mobile.validator';
import { AdminSchoolsService } from '@/modules/admin/services';
import { StatesSelectComponent } from '@/shared/catalog';
import { GenderSelectComponent } from '@/shared/catalog/gender/gender-select.component';
import { InputComponent } from '@/shared/components';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Message } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ISchoolRequest } from '../models/schools';

@Component({
  selector: 'app-admin-school-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    TextareaModule,
    UikitFieldComponent,
    DividerModule,
    StatesSelectComponent,
    SelectModule,
    GenderSelectComponent,
    Message,
    FormFooterActionsComponent,
    InputComponent,
  ],
  templateUrl: './admin-school-form.component.html',
})
export class AdminSchoolFormComponent {
  private fb = inject(FormBuilder);

  // Validator that ensures at least one of mobile or email is filled in managerInfo
  private atLeastOneContactValidator: ValidatorFn = (
    group: AbstractControl,
  ): ValidationErrors | null => {
    const mobile = group.get('mobile')?.value;
    const email = group.get('email')?.value;

    const hasMobile = !!(mobile && String(mobile).trim().length > 0);
    const hasEmail = !!(email && String(email).trim().length > 0);

    return hasMobile || hasEmail ? null : { atLeastOneContact: true };
  };

  @Input() visible = false;
  @Input() defaultValues?: Maybe<Partial<ISchoolRequest>>;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ISchoolRequest>();

  constructor(
    private adminSchoolsService: AdminSchoolsService,
    private toastService: ToastService,
  ) {}

  onSubmitLoading = signal<boolean>(false);

  form = this.fb.group({
    name: [this.defaultValues?.name || '', [Validators.required]],
    address: this.fb.group({
      address: [this.defaultValues?.address?.address || '', [Validators.required]],
      postalCode: [
        this.defaultValues?.address?.postalCode || '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
      ],
      regionId: [this.defaultValues?.address?.regionId || null, [Validators.required]],
      state: [Number.MAX_SAFE_INTEGER, [Validators.required]],
    }),
    managerInfo: this.fb.group(
      {
        firstName: [this.defaultValues?.managerInfo?.firstName || '', [Validators.required]],
        lastName: [this.defaultValues?.managerInfo?.lastName || '', [Validators.required]],
        mobile: [this.defaultValues?.managerInfo?.mobile || '', [mobileValidator()]],
        email: [this.defaultValues?.managerInfo?.email || '', [Validators.email]],
        gender: [this.defaultValues?.managerInfo?.gender || '', [Validators.required]],
      },
      { validators: [this.atLeastOneContactValidator] },
    ),
    username: [this.defaultValues?.username || '', [Validators.required]],
    password: [this.defaultValues?.password || '', [Validators.required, password()]],
  });

  editMode = computed(() => Boolean(this.defaultValues));
  get isManagerContactInvalid() {
    const managerGroup = this.form.controls.managerInfo;
    const emailControl = managerGroup.controls.email;
    const mobileControl = managerGroup.controls.mobile;

    const emailTouched = !!(emailControl.touched || emailControl.dirty);
    const mobileTouched = !!(mobileControl.touched || mobileControl.dirty);

    const emailInvalid = !!(emailControl.invalid && emailTouched);
    const mobileInvalid = !!(mobileControl.invalid && mobileTouched);

    const groupHasAtLeastOneError = !!(
      managerGroup.errors && (managerGroup.errors as any).atLeastOneContact
    );
    const showGroupError =
      groupHasAtLeastOneError && (emailTouched || mobileTouched || managerGroup.touched);

    return emailInvalid || mobileInvalid || showGroupError;
  }

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
    const payload = this.form.value as ISchoolRequest;
    this.adminSchoolsService.addSchool(payload).subscribe({
      next: () => {
        this.toastService.success({ text: `مرکز آموزشی  ${payload.name} با موفقیت اضافه شد.` });
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
