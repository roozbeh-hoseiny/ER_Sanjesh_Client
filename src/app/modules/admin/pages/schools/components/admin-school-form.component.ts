import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

import { ISchoolRequest } from '../models/schools';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';

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
  @Input() defaultValues?: Partial<ISchoolRequest>;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ISchoolRequest>();

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

  open() {
    this.visible = true;
    this.visibleChange.emit(this.visible);
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  submit() {
    if (this.form.invalid) return;
    const payload: ISchoolRequest = this.form.value as ISchoolRequest;
    this.save.emit(payload);
    this.close();
  }
}
