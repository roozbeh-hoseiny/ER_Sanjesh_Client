import { AuthStore } from '@/modules/auth/state';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { StyleClassModule } from 'primeng/styleclass';
import images from 'src/assets/images';
import { ChangePasswordFormDialogComponent } from '../../shared/components/changePasswordDialog/wrapper.component';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-topbar',
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    MenuModule,
    Button,
    ChangePasswordFormDialogComponent,
  ],
  templateUrl: './app.topbar.component.html',
})
export class AppTopbar {
  items!: MenuItem[];

  constructor(public layoutService: LayoutService) {}
  private readonly authStore = inject(AuthStore);

  readonly logo = images.logo;

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  visibleChangePasswordDialog = signal(false);

  username = computed(() => this.authStore.user()?.fullName || 'کاربر ناشناس');
  role = computed(() => this.authStore.userRole());
  canChangePassword = computed(() => this.role()?.toUpperCase() === 'SCHOOL');

  logout = () => {
    this.authStore.logout();
  };

  onChangePassword = () => {
    this.visibleChangePasswordDialog.set(true);
  };

  profileMenuItems = computed(() => {
    const items = [
      {
        label: this.username(),
        icon: 'pi pi-user',
        disabled: true,
      },

      {
        label: 'راهنمای سامانه',
        icon: 'pi pi-question-circle',
        disabled: true,
      },
      {
        label: 'خروج',
        icon: 'pi pi-sign-out',
        command: this.logout,
      },
    ];
    if (this.canChangePassword()) {
      items.splice(1, 0, {
        label: 'تغییر گذرواژه',
        icon: 'pi pi-key',
        command: this.onChangePassword,
      });
    }
    return items;
  });
}
