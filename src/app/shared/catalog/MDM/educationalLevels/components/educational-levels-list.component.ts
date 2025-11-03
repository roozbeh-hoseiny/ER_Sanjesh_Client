import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { EducationalLevelsService } from '../services';

@Component({
  selector: 'educational-levels-list',
  templateUrl: './educational-levels-list.component.html',
  imports: [CommonModule, TableModule, PageDataListComponent],
})
export class EducationalLevelsListComponent {
  @Input() canAdd: boolean = false;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;

  private educationalLevelsService = inject(EducationalLevelsService);

  items = signal<any[]>([]);
  loading = signal<boolean>(true);

  columns = [
    {
      field: 'title',
      header: 'عنوان',
    },
  ] as IColumn[];

  ngOnInit(): void {
    this.loading.set(true);
    this.educationalLevelsService.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
      },
      error: () => {
        this.items.set([]);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  onAdd(): void {}

  onEdit(item: any): void {
    console.log(item);
  }

  onDelete(item: any): void {
    console.log(item);
  }
}
