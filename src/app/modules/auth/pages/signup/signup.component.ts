import { ISignupRequestPayload, Maybe } from '@/core/models';
import { mobileValidator, MustMatch } from '@/core/validators';
import { password } from '@/core/validators/password.validator';
import { GenderSelectComponent } from '@/shared/catalog/gender/gender-select.component';
import { InputComponent } from '@/shared/components';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Password } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AuthStore } from '../../state';

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
  constructor(private readonly store: AuthStore) {}

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
    this.store.signup(credentials).subscribe({
      next: () => {
        this.form.reset();
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
      },
    });
  }
}
