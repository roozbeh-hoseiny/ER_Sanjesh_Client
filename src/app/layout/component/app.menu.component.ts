import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem.component';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  templateUrl: './app.menu.component.html',
})
export class AppMenu {
  private layoutService = inject(LayoutService);

  get model() {
    return this.layoutService.menuItems();
  }
}
