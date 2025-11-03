import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { AdminMDMService } from '@/modules/admin/services';

@Component({
  selector: 'app-admin-mdm-states',
  templateUrl: './admin-mdm-states.component.html',
  imports: [CommonModule, TableModule, PageDataListComponent],
})
export class AdminMdmStatesComponent {
  private breadcrumbService = inject(BreadcrumbService);
  private adminMDMServices = inject(AdminMDMService);

  items = signal<any[]>([]);
  loading = signal<boolean>(true);

  columns = [
    {
      field: 'title',
      header: 'عنوان',
    },
  ] as IColumn[];

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      adminNamedRoutes.root.meta,
      adminNamedRoutes.mdm.meta,
      adminNamedRoutes.mdmRegions.meta,
    ]);

    this.loading.set(true);

    this.adminMDMServices.getStates().subscribe((data) => {
      this.items.set(data);
      this.loading.set(false);
    });
  }

  openNewEducationalLevelDialog = () => {};
  remove = (item: any) => {};
  edit = (item: any) => {};
}
