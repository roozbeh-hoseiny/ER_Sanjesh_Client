import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ADMIN_MENU_ITEMS } from './constants';
import { AppLayout } from '@/layout/component/app.layout.component';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [AppLayout, RouterOutlet],
  template: `<app-layout>
    <router-outlet></router-outlet>
  </app-layout>`,
})
export class AdminLayoutComponent implements OnInit {
  private layoutService = inject(LayoutService);

  ngOnInit() {
    this.layoutService.setMenuItems(ADMIN_MENU_ITEMS);
    console.log(this.layoutService.menuItems());
  }
}
