import { Component, inject } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '@/core/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule],
  template: ` <p-breadcrumb [model]="items"></p-breadcrumb> `,
})
export class BreadcrumbComponent {
  private breadcrumbService = inject(BreadcrumbService);

  get items(): MenuItem[] {
    return this.breadcrumbService.items.map((item) => ({
      ...item,
      label: item.title || '',
    }));
  }
}
