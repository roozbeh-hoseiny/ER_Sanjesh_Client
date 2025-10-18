import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { UikitEmptyStateComponent } from '@/uikit/uikit-emptystate.component';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { AdminEducationalLevelsFakeService } from '@/modules/admin/services/admin-educational-levels-fake.service';
import { TableActionRowComponent } from '@/shared/components/table-action-row.component';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-admin-mdm-educational-levels',
  templateUrl: './admin-mdm-educational-levels.component.html',
  imports: [CommonModule, TableModule, UikitEmptyStateComponent, Button, TableActionRowComponent],
  styles: [
    `
      :host {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class AdminMdmEducationalLevelsComponent {
  private breadcrumbService = inject(BreadcrumbService);
  private educationalLevelsService = inject(AdminEducationalLevelsFakeService);

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
  ] as Column[];

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {
        ...adminNamedRoutes.dashboard.meta,
      },
      {
        ...adminNamedRoutes.mdm.meta,
      },
      {
        ...adminNamedRoutes.mdmEducationalLevels.meta,
      },
    ]);

    this.loading.set(true);

    this.educationalLevelsService.getEducationalLevels().subscribe((data) => {
      this.educationalLevels.set(data);
      this.loading.set(false);
    });
  }

  openNewEducationalLevelDialog = () => {};
  remove = (item: any) => {};
  edit = (item: any) => {};
}
