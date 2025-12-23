import { TRoles } from '@/core';
import { UikitLabelComponent } from '@/uikit';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RadioButton } from 'primeng/radiobutton';
import { CENTRAL_AUTH_ROLES } from '../constants/central-auth-roles.const';
import { AuthStore } from '../state';

@Component({
  selector: 'app-auth-select-roles',
  templateUrl: './select-roles.component.html',
  imports: [RadioButton, UikitLabelComponent, ReactiveFormsModule],
})
export class AuthSelectRolesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AuthStore);

  constructor() {
    this.selectedRoleControl.valueChanges.subscribe((role) => {
      this.store.setSelectedRole(role);
    });
  }

  readonly centralAuthRoles = CENTRAL_AUTH_ROLES;
  selectedRoleControl = this.fb.control<TRoles>(this.store.selectedRole(), { nonNullable: true });
}
