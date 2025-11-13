import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FieldOfStudiesService } from '../services';

@Component({
  selector: 'field-of-studies-list',
  templateUrl: './field-of-studies-list.component.html',
  imports: [CommonModule, TableModule, PageDataListComponent],
})
export class FieldOfStudiesListComponent {
  @Input() canAdd: boolean = false;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;

  @Output() onAddClick = new EventEmitter<void>();

  private fieldOfStudiesService = inject(FieldOfStudiesService);

  items = signal<any[]>([]);
  loading = signal<boolean>(true);

  columns = [
    {
      field: 'title',
      header: 'عنوان',
    },
    {
      field: 'educationalLevelTitle',
      header: 'سطح تحصیلی',
    },
  ] as IColumn[];

  ngOnInit(): void {
    this.loading.set(true);
    this.fieldOfStudiesService.getAll().subscribe({
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

  onAdd(): void {
    console.log('onAdd');

    this.onAddClick.emit();
  }

  onEdit(item: any): void {
    console.log(item);
  }

  onDelete(item: any): void {
    console.log(item);
  }
}
