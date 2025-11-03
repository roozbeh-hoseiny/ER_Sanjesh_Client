import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, InputOtpModule, FormsModule, ButtonDirective],
  templateUrl: './otp.component.html',
})
export class OTPComponent {
  otpCode = signal<string>('');
  submitLoading = signal<boolean>(false);

  submit = () => {};
}
