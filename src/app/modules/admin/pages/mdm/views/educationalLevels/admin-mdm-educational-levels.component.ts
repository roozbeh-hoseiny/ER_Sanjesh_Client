import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { EducationalLevelsListComponent } from '@/shared/catalog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-admin-mdm-educational-levels',
  templateUrl: './admin-mdm-educational-levels.component.html',
  imports: [EducationalLevelsListComponent],
})
export class AdminMdmEducationalLevelsComponent {
  private breadcrumbService = inject(BreadcrumbService);

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      adminNamedRoutes.root.meta,
      adminNamedRoutes.mdm.meta,
      adminNamedRoutes.mdmEducationalLevels.meta,
    ]);
  }
}
