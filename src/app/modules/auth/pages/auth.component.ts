import { IAuthResponse, TRoles } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import images from 'src/assets/images';
import { LoginComponent } from './login/login.component';
import { ModifyLoginInfoComponent } from './modifyLoginInfo/modify-login-info.component';
import { OTPComponent } from './otp/otp.component';

type TSteps = 'login' | 'otp' | 'modifyLoginInfo';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  imports: [LoginComponent, OTPComponent, ModifyLoginInfoComponent],
})
export class AuthComponent {
  @Input() redirectUrl!: string;
  @Input() loginApiUrl!: string;
  @Input() role?: TRoles;
  @Input() defaultStep: TSteps = 'login';

  @Output() submit = new EventEmitter<Promise<boolean>>();

  readonly toastService = inject(ToastService);

  readonly logo = images.logo;
  readonly authVector = images.login;

  activeStep = signal<TSteps>(this.defaultStep);

  toggleActiveStep = () => {
    this.activeStep.update((prev) => (prev === 'login' ? 'otp' : 'login'));
  };
  onLoggedIn = (data: IAuthResponse) => {
    if (data.mustChangePassword) {
      this.activeStep.set('modifyLoginInfo');
      return;
    }

    return this.submit.emit(Promise.resolve(true));
  };
}
