import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { FieldOfStudiesListComponent, FieldOfStudiesService } from '@/shared/catalog';
import { Component, signal } from '@angular/core';
import { FieldFormDialogComponent } from './components/form-dialog.component';

@Component({
  selector: 'app-admin-mdm-field-of-studies',
  templateUrl: './admin-mdm-field-of-studies.component.html',
  imports: [FieldOfStudiesListComponent, FieldFormDialogComponent],
})
export class AdminMdmFieldOfStudiesComponent {
  constructor(
    private breadcrumbService: BreadcrumbService,
    private mdmService: FieldOfStudiesService,
  ) {}

  isOpenAddForm = signal(false);

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      adminNamedRoutes.root.meta,
      adminNamedRoutes.mdm.meta,
      adminNamedRoutes.mdmFieldOfStudies.meta,
    ]);
  }

  onAddClick() {
    this.isOpenAddForm.set(true);
  }

  refreshData() {
    this.mdmService.getAll();
  }
}
