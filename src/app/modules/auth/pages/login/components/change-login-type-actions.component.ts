import { AuthStore } from '@/modules/auth/state';
import { Component, computed, inject } from '@angular/core';

@Component({
  selector: 'change-login-type-actions',
  templateUrl: './change-login-type-actions.component.html',
})
export class ChangeLoginTypeActionsComponent {
  private readonly store = inject(AuthStore);

  loginType = computed(() => this.store.loginType());

  toPasswordLogin() {
    this.store.setLoginType('PASSWORD');
  }
  toOTPLogin() {
    this.store.setLoginType('OTP');
  }
  toVoiceOTPLogin() {
    this.store.setLoginType('VOICE_OTP');
  }
}
