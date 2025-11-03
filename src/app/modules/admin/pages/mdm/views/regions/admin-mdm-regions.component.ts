import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { StatesListComponent } from '@/shared/catalog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-admin-mdm-regions',
  templateUrl: './admin-mdm-regions.component.html',
  imports: [StatesListComponent],
})
export class AdminMdmRegionsComponent {
  private breadcrumbService = inject(BreadcrumbService);

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      adminNamedRoutes.root.meta,
      adminNamedRoutes.mdm.meta,
      adminNamedRoutes.mdmRegions.meta,
    ]);
  }

  openNewEducationalLevelDialog = () => {};
  remove = () => {};
  edit = () => {};
}
