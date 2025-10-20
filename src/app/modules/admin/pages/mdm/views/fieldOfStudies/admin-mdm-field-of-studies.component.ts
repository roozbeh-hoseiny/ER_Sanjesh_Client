import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PageDataListComponent } from '@/shared/components/pageDataList/page-data-list.component';
import { AdminMDMService } from '@/modules/admin/services';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-admin-mdm-field-of-studies',
  templateUrl: './admin-mdm-field-of-studies.component.html',
  imports: [CommonModule, TableModule, PageDataListComponent],
})
export class AdminMdmFieldOfStudiesComponent {
  private breadcrumbService = inject(BreadcrumbService);
  private adminMDMServices = inject(AdminMDMService);

  fieldOfStudies = signal<any[]>([]);
  loading = signal<boolean>(true);

  columns = [
    {
      field: 'title',
      header: 'عنوان',
    },
  ] as Column[];

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {
        ...adminNamedRoutes.root.meta,
      },
      {
        ...adminNamedRoutes.mdm.meta,
      },
      {
        ...adminNamedRoutes.mdmFieldOfStudies.meta,
      },
    ]);

    this.loading.set(true);

    this.adminMDMServices.getFieldOfStudies().subscribe((data) => {
      this.fieldOfStudies.set(data);
      this.loading.set(false);
    });
  }

  openNewFormDialog = () => {};
  remove = (item: any) => {};
  edit = (item: any) => {};
}
