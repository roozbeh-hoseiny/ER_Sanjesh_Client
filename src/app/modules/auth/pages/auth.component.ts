import { LoginCredentials } from '@/core';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import images from 'src/assets/images';
import { LoginComponent } from './login/login.component';
import { OTPComponent } from './otp/otp.component';

type TSteps = 'login' | 'otp';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  imports: [LoginComponent, OTPComponent],
})
export class AuthComponent {
  @Input() redirectUrl!: string;
  @Input() loginApiUrl!: string;
  @Input() certainRole: boolean = false;

  @Output() submit = new EventEmitter<Promise<boolean>>();

  readonly logo = images.logo;
  readonly authVector = images.login;

  activeStep = signal<TSteps>('login');

  toggleActiveStep = () => {
    this.activeStep.update((prev) => (prev === 'login' ? 'otp' : 'login'));
  };
  onLogin = (data: LoginCredentials) => {};
}
