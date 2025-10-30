import { AppLayout } from '@/layout/component/app.layout.component';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { SCHOOLS_MENU_ITEMS } from './constants';
import { SchoolsAuthService } from './services';

@Component({
  selector: 'schools-layout',
  standalone: true,
  imports: [AppLayout, RouterOutlet, ProgressSpinner],
  template: `<app-layout>
    @if (initLoading()) {
      <div class="flex justify-center align-items-center h-full">
        <p-progressSpinner></p-progressSpinner>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  </app-layout>`,
})
export class SchoolsLayoutComponent implements OnInit {
  private layoutService = inject(LayoutService);
  private schoolsAuthService = inject(SchoolsAuthService);
  private router = inject(Router);

  initLoading = signal<boolean>(true);

  ngOnInit() {
    this.layoutService.setMenuItems(SCHOOLS_MENU_ITEMS);
    this.getInfo();
  }

  private getInfo(): void {
    this.schoolsAuthService.me().subscribe({
      next: () => {
        this.initLoading.set(false);
      },
      error: () => {
        this.router.navigate(['/']);
        this.initLoading.set(false);
      },
    });
  }
}
