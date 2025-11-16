import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { EducationalLevelStore } from '../index';

@Component({
  selector: 'educational-levels-list',
  templateUrl: './educational-levels-list.component.html',
  imports: [CommonModule, TableModule, PageDataListComponent],
})
export class EducationalLevelsListComponent {
  @Input() canAdd: boolean = false;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;

  @Output() onOpenForm = new EventEmitter<void>();

  constructor(private store: EducationalLevelStore) {}

  items = computed(() => this.store.items() || []);
  loading = computed(() => this.store.loading());

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

  onAdd(): void {
    this.onOpenForm.emit();
  }

  onEdit(item: any): void {
    console.log(item);
  }

  onDelete(item: any): void {
    console.log(item);
  }
}
