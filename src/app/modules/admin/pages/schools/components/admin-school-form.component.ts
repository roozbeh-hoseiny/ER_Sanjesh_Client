import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  SimpleChanges,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

import { ISchoolRequest } from '../models/schools';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Maybe } from '@/core';
import { AdminSchoolsService } from '@/modules/admin/services';
import { MessageService } from 'primeng/api';

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

  form = this.fb.group({
    name: [this.defaultValues?.name || '', [Validators.required]],
    address: this.fb.group({
      address: [this.defaultValues?.address?.address || ''],
      postalCode: [this.defaultValues?.address?.postalCode || ''],
      cityName: [this.defaultValues?.address?.cityName || ''],
      stateName: [this.defaultValues?.address?.stateName || ''],
    }),
    managerInfo: this.fb.group({
      firstName: [this.defaultValues?.managerInfo?.firstName || '', [Validators.required]],
      lastName: [this.defaultValues?.managerInfo?.lastName || '', [Validators.required]],
      mobile: [this.defaultValues?.managerInfo?.mobile || ''],
      email: [this.defaultValues?.managerInfo?.email || ''],
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
          cityName: address?.cityName ?? '',
          stateName: address?.stateName ?? '',
        },
        managerInfo: {
          firstName: managerInfo?.firstName ?? '',
          lastName: managerInfo?.lastName ?? '',
          mobile: managerInfo?.mobile ?? '',
          email: managerInfo?.email ?? '',
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
    if (this.form.invalid) return;
    const payload = this.form.value as ISchoolRequest;
    this.adminSchoolsService.addSchool(payload).subscribe(() => {
      this.messageService.add({ severity: 'success', detail: 'مدرسه با موفقیت اضافه شد.' });
      this.save.emit(payload);
      this.close();
    });
  }
}
