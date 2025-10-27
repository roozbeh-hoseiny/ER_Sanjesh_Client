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
import { AdminSchoolsService } from '@/modules/admin/services';
import { StatesSelectComponent } from '@/shared/catalog';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { MessageService } from 'primeng/api';
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
  messageService = inject(MessageService);

  onSubmitLoading = signal<boolean>(false);

  form = this.fb.group({
    name: [this.defaultValues?.name || '', [Validators.required]],
    address: this.fb.group({
      address: [this.defaultValues?.address?.address || '', [Validators.required]],
      postalCode: [this.defaultValues?.address?.postalCode || '', [Validators.required]],
      regionId: [this.defaultValues?.address?.regionId || null, [Validators.required]],
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
    password: [this.defaultValues?.password || '', [Validators.required, Validators.minLength(6)]],
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
      const { name, address, managerInfo, username, password } = this.defaultValues;
      this.form.patchValue({
        name: name ?? '',
        address: {
          address: address?.address ?? '',
          postalCode: address?.postalCode ?? '',
          regionId: address?.regionId ?? null,
        },
        managerInfo: {
          firstName: managerInfo?.firstName ?? '',
          lastName: managerInfo?.lastName ?? '',
          mobile: managerInfo?.mobile ?? '',
          email: managerInfo?.email ?? '',
          gender: managerInfo?.gender ?? '',
        },
        username: username ?? '',
        password: password ?? '',
      });
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
    console.log(this.form.getRawValue());

    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.onSubmitLoading.set(true);
    const payload = this.form.value as ISchoolRequest;
    this.adminSchoolsService.addSchool(payload).subscribe(() => {
      this.messageService.add({ severity: 'success', detail: 'مدرسه با موفقیت اضافه شد.' });
      this.save.emit(payload);
      this.close();
    });
  }
}
