import { IAuthResponse, TRoles } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
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

  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly logo = images.logo;
  readonly authVector = images.login;

  activeStep = signal<TSteps>(this.defaultStep);

  selectedRole = signal<TRoles | undefined>(this.role);

  onLoggedIn = (data: IAuthResponse) => {
    this.toastService.success({ text: 'شما با موفقیت وارد شدید.' });
    this.selectedRole.set(data.role.toUpperCase() as TRoles);
    if (data.mustChangePassword) {
      this.activeStep.set('modifyLoginInfo');
      return;
    }

    if (this.submit.observed) {
      return this.submit.emit(Promise.resolve(true));
    }
    this.redirectToDashboard();
  };

  onModifyLoginInfo = () => {
    console.log('onModifyLoginInfo');
    console.log(this.submit.observed);

    if (this.submit.observed) {
      return this.submit.emit(Promise.resolve(true));
    }
    this.redirectToDashboard();
  };

  private redirectToDashboard() {
    let redirectUrl = this.redirectUrl;

    if (!redirectUrl) {
      switch (this.selectedRole()) {
        case 'SCHOOL':
          redirectUrl = '/schools';
          break;
        case 'ADMIN':
          redirectUrl = '/admin';
          break;
        case 'TEACHERS':
          redirectUrl = '/teachers';
          break;
        case 'STUDENTS':
          redirectUrl = '/students';
          break;
      }
    }
    this.router.navigateByUrl(redirectUrl);
  }
}
