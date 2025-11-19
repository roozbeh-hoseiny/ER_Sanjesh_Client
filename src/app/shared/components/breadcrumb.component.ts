import { BreadcrumbService } from '@/core/services/breadcrumb.service';
import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule, TooltipModule],
  templateUrl: './breadcrumb.component.html',
  host: { class: 'block w-full relative' },
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
