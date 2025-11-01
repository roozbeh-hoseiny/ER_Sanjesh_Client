import { AuthService } from '@/core';
import { IUserLoginInfo, TRoles } from '@/core/models';
import { ToastService } from '@/core/services/toast.service';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';

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
  @Input() userLoginInfo!: Partial<IUserLoginInfo>;
  @Input() role!: TRoles;

  @Output() onSubmit = new EventEmitter<IUserLoginInfo>();
  @Output() toLogin = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = this.authService.isLoading();
  readonly errorMessage = signal<string>('');
  readonly hidePassword = signal<boolean>(true);

  readonly infoForm = this.fb.group({
    username: [this.userLoginInfo?.username, [Validators.required]],
    password: [this.userLoginInfo?.password, [Validators.required]],
    mobile: [this.userLoginInfo?.mobile, [Validators.required]],
    email: [this.userLoginInfo?.email, [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.authService.getInfo(this.role).subscribe({
      next: (info) => {
        this.infoForm.patchValue(info);
      },
      error: () => {
        this.toLogin.emit();
      },
    });
  }

  submit(): void {
    if (this.infoForm.valid) {
      const credentials: IUserLoginInfo = this.infoForm.value as IUserLoginInfo;

      this.authService.changeInfo(credentials, this.role).subscribe({
        next: () => {
          this.toastService.success({
            text: 'اطلاعات با موفقیت به‌روزرسانی شد',
          });
          this.errorMessage.set('');
          this.onSubmit?.emit();
          // this.router.navigateByUrl(this.redirectUrl.replace(/\/[^/]*$/, ''));
        },
        error: (error) => {
          // this.errorMessage.set('نام کاربری یا رمز عبور اشتباه است');
        },
      });
    }
  }
}
