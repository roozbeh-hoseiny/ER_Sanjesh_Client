import { AuthService } from '@/core';
import { ISignupRequestPayload, IUserLoginInfo, Maybe, TRoles } from '@/core/models';
import { ToastService } from '@/core/services/toast.service';
import { mobileValidator, MustMatch } from '@/core/validators';
import { password } from '@/core/validators/password.validator';
import { GenderSelectComponent } from '@/shared/catalog/gender/gender-select.component';
import { InputComponent } from '@/shared/components';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Password } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'auth-signup',
  templateUrl: './signup.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Password,
    ImageModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    UikitFieldComponent,
    InputComponent,
    GenderSelectComponent,
  ],
})
export class SignupComponent {
  @Input() userLoginInfo!: Partial<IUserLoginInfo>;
  @Input() role!: TRoles;

  @Output() onSubmit = new EventEmitter<IUserLoginInfo>();
  @Output() toLogin = new EventEmitter<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly router: Router,
  ) {}

  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly hidePassword = signal<boolean>(true);

  readonly form = this.fb.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: [null as Maybe<boolean>, [Validators.required]],
      mobile: ['', [Validators.required, mobileValidator()]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, password()]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [MustMatch('password', 'confirmPassword')],
    },
  );

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;
    const credentials = this.form.value as ISignupRequestPayload;
    this.isLoading.set(true);
    this.authService.signup(credentials, this.role).subscribe({
      next: () => {
        this.toastService.success({
          text: 'ثبت نام با موفقیت انجام شد. لطفا وارد شوید.',
        });
        this.errorMessage.set('');
        this.onSubmit?.emit();
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
      },
    });
  }
}
