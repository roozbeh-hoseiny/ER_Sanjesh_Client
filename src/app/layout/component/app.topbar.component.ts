import { AuthService } from '@/core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { StyleClassModule } from 'primeng/styleclass';
import images from 'src/assets/images';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, MenuModule, Button],
  templateUrl: './app.topbar.component.html',
})
export class AppTopbar {
  items!: MenuItem[];

  constructor(public layoutService: LayoutService) {}
  private authService: AuthService = inject(AuthService);

  readonly logo = images.logo;

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  username = computed(() => this.authService.currentUser()?.fullName || 'کاربر ناشناس');

  logout = () => {
    this.authService.logout();
  };

  profileMenuItems: MenuItem[] = [
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
}
