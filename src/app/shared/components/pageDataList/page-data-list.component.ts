import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableActionRowComponent } from '../table-action-row.component';
import { UikitEmptyStateComponent } from '@/uikit';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';

export interface IColumn {
  field: string;
  header: string;
}

@Component({
  selector: 'app-page-data-list',
  templateUrl: './page-data-list.component.html',
  imports: [
    TableActionRowComponent,
    UikitEmptyStateComponent,
    TableModule,
    ButtonModule,
    SkeletonModule,
    PaginatorModule,
  ],
})
export class PageDataListComponent<I> {
  @Input() pageTitle!: string;
  @Input() addNewCtaLabel?: string;
  @Input() columns!: IColumn[];
  @Input() items!: I[];
  @Input() loading!: boolean;
  @Input() emptyPlaceholderTitle: string = 'موردی برای نمایش وجود ندارد';
  @Input() emptyPlaceholderDescription?: string = '';
  @Input() emptyPlaceholderCtaLabel?: string = 'افزودن نمونه‌ی جدید';
  @Input() totalRecords!: number;
  @Input() perPage?: number = 10;
  @Input() showEdit: boolean = false;
  @Input() showDelete: boolean = false;
  @Input() lazy: boolean = false;

  @Output() onEdit = new EventEmitter<I>();
  @Output() onDelete = new EventEmitter<I>();
  @Output() onAdd = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<any>();

  edit = (item: I) => {
    this.onEdit.emit(item);
  };
  remove = (item: I) => {
    this.onDelete.emit(item);
  };
  openAddForm = () => {
    this.onAdd.emit();
  };
  onPage = ($event: any) => {
    this.pageChange.emit($event);
  };

  get showPaginator(): boolean {
    return !!(this.totalRecords && this.perPage && this.totalRecords > this.perPage);
  }
}
