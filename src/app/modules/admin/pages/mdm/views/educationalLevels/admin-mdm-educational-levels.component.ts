import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { EducationLevelsService } from '@/shared/catalog/MDM/educationalLevels/educationLevels.service';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { AdminMDMService } from '@/modules/admin/services';

@Component({
  selector: 'app-admin-mdm-educational-levels',
  templateUrl: './admin-mdm-educational-levels.component.html',
  imports: [CommonModule, TableModule, PageDataListComponent],
})
export class AdminMdmEducationalLevelsComponent {
  private breadcrumbService = inject(BreadcrumbService);
  private adminMDMServices = inject(AdminMDMService);

  educationalLevels = signal<any[]>([]);
  loading = signal<boolean>(true);

  columns = [
    {
      field: 'title',
      header: 'عنوان',
    },
    {
      field: 'level',
      header: 'پایه',
    },
  ] as IColumn[];

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {
        ...adminNamedRoutes.root.meta,
      },
      {
        ...adminNamedRoutes.mdm.meta,
      },
      {
        ...adminNamedRoutes.mdmEducationalLevels.meta,
      },
    ]);

    this.loading.set(true);

    this.adminMDMServices.getEducationalLevels().subscribe((data) => {
      this.educationalLevels.set(data);
      this.loading.set(false);
    });
  }

  openNewEducationalLevelDialog = () => {};
  remove = (item: any) => {};
  edit = (item: any) => {};
}
