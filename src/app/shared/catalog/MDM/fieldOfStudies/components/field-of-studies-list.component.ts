import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FieldOfStudiesStore } from '../dataStore/store';

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

  constructor(private store: FieldOfStudiesStore) {}

  items = computed(() => this.store.items() || []);
  loading = computed(() => this.store.loading());

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

  onAdd(): void {
    this.onAddClick.emit();
  }

  onEdit(item: any): void {
    console.log(item);
  }

  onDelete(item: any): void {
    console.log(item);
  }
}
