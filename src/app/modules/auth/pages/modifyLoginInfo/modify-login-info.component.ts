import { AuthService } from '@/core';
import { IUserLoginInfo, TRoles } from '@/core/models';
import { MustMatch } from '@/core/validators';
import { password } from '@/core/validators/password.validator';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AuthStore } from '../../state';

@Component({
  selector: 'app-modify-login-info',
  templateUrl: './modify-login-info.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Password,
    InputText,
    ImageModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    UikitFieldComponent,
    Message,
  ],
})
export class ModifyLoginInfoComponent {
  private readonly store = inject(AuthStore);
  private readonly service = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly hidePassword = signal<boolean>(true);

  readonly role: TRoles = this.store.selectedRole();
  readonly userLoginInfo = this.store.pendingUserInfo();

  readonly infoForm = this.fb.group(
    {
      username: [this.userLoginInfo?.username, [Validators.required]],
      password: ['', [Validators.required, password()]],
      confirmPassword: ['', [Validators.required]],
      mobile: [this.userLoginInfo?.mobile, [Validators.required]],
      email: [this.userLoginInfo?.email, [Validators.required, Validators.email]],
    },
    {
      validators: [MustMatch('password', 'confirmPassword')],
    },
  );

  ngOnInit() {
    this.service.getInfo(this.role).subscribe({
      next: (info) => {
        this.infoForm.patchValue(info);
      },
      error: () => {
        this.store.setAuthStep('login');
      },
    });
  }

  submit(): void {
    this.infoForm.markAllAsTouched();
    if (this.infoForm.invalid) return;
    const credentials = this.infoForm.value as IUserLoginInfo;
    this.isLoading.set(true);
    this.store.modifyInfo(credentials).subscribe({
      next: () => {
        this.errorMessage.set('');
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
      },
    });
  }
}
