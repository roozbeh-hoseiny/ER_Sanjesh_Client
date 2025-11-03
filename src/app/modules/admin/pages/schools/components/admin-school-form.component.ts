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
import { AdminSchoolsService } from '@/modules/admin/services';
import { StatesSelectComponent } from '@/shared/catalog';
import { GenderSelectComponent } from '@/shared/catalog/gender/gender-select.component';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
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
  ],
  templateUrl: './admin-school-form.component.html',
})
export class AdminSchoolFormComponent {
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Input() defaultValues?: Maybe<Partial<ISchoolRequest>>;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ISchoolRequest>();

  adminSchoolsService = inject(AdminSchoolsService);
  toastService = inject(ToastService);

  onSubmitLoading = signal<boolean>(false);

  // Password must be minimum 8 characters, include at least one uppercase, one lowercase, one number and one special character
  private readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  form = this.fb.group({
    name: [this.defaultValues?.name || '', [Validators.required]],
    address: this.fb.group({
      address: [this.defaultValues?.address?.address || '', [Validators.required]],
      postalCode: [this.defaultValues?.address?.postalCode || '', [Validators.required]],
      regionId: [this.defaultValues?.address?.regionId || null, [Validators.required]],
      state: [Number.MAX_SAFE_INTEGER, [Validators.required]],
      city: [Number.MAX_SAFE_INTEGER, [Validators.required]],
    }),
    managerInfo: this.fb.group({
      firstName: [this.defaultValues?.managerInfo?.firstName || '', [Validators.required]],
      lastName: [this.defaultValues?.managerInfo?.lastName || '', [Validators.required]],
      mobile: [this.defaultValues?.managerInfo?.mobile || '', [Validators.required]],
      email: [
        this.defaultValues?.managerInfo?.email || '',
        [Validators.required, Validators.email],
      ],
      gender: [this.defaultValues?.managerInfo?.gender || '', [Validators.required]],
    }),
    username: [this.defaultValues?.username || '', [Validators.required]],
    password: [
      this.defaultValues?.password || '',
      [Validators.required, Validators.pattern(this.passwordPattern)],
    ],
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
    const payload = this.form.value as ISchoolRequest;
    this.adminSchoolsService
      .addSchool({
        ...payload,
        address: { ...payload.address, regionId: this.form.value.address?.city as number },
      })
      .subscribe(() => {
        this.toastService.success({ text: 'مدرسه با موفقیت اضافه شد.' });
        this.save.emit(payload);
        this.close();
      });
  }
}
