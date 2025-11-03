import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { FieldOfStudiesListComponent } from '@/shared/catalog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-admin-mdm-field-of-studies',
  templateUrl: './admin-mdm-field-of-studies.component.html',
  imports: [FieldOfStudiesListComponent],
})
export class AdminMdmFieldOfStudiesComponent {
  private breadcrumbService = inject(BreadcrumbService);

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      adminNamedRoutes.root.meta,
      adminNamedRoutes.mdm.meta,
      adminNamedRoutes.mdmFieldOfStudies.meta,
    ]);
  }
}
