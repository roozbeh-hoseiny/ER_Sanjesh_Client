import { BreadcrumbService } from '@/core/services/breadcrumb.service';
import { Component, computed, inject } from '@angular/core';
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
  items = computed(() => {
    return this.breadcrumbService._items();
  });

  // get items() {
  //   console.log('asd');

  //   return this.breadcrumbService._items();
  // }
}
