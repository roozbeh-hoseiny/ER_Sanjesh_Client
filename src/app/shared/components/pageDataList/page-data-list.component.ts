import { PaginatorComponent, UikitEmptyStateComponent } from '@/uikit';
import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  signal,
  TemplateRef,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TableActionRowComponent } from '../table-action-row.component';

export interface IColumn {
  field: string;
  header: string;
  width?: string;
  minWidth?: string;
  customDataModel?: TemplateRef<any> | ((item: any) => string | number | boolean);
}

@Component({
  selector: 'app-page-data-list',
  templateUrl: './page-data-list.component.html',
  imports: [
    CommonModule,
    TableActionRowComponent,
    UikitEmptyStateComponent,
    TableModule,
    ButtonModule,
    SkeletonModule,
    PaginatorModule,
    DrawerModule,
    PaginatorComponent,
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
  @Input() currentPage?: number = 1;
  @Input() showEdit: boolean = false;
  @Input() showDelete: boolean = false;
  @Input() showAdd: boolean = false;
  @Input() isFiltered: boolean = false;

  @ContentChild('filter', { static: true }) filter!: TemplateRef<any> | null;

  @Output() onEdit = new EventEmitter<I>();
  @Output() onDelete = new EventEmitter<I>();
  @Output() onAdd = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<any>();

  filterDrawerVisible = signal<boolean>(false);

  edit = (item: I) => {
    this.onEdit.emit(item);
  };

  remove = (item: I) => {
    this.onDelete.emit(item);
  };

  openAddForm = () => {
    this.onAdd.emit();
  };

  openFilter = () => {
    this.filterDrawerVisible.set(true);
  };

  closeFilter = () => {
    this.filterDrawerVisible.set(false);
  };

  onPage = ($event: any) => {
    this.pageChange.emit($event);
  };

  get showPaginator() {
    return !!(this.totalRecords && this.perPage && this.totalRecords > this.perPage);
  }

  getCell(item: Record<string, any>, column: IColumn): any {
    if (!item || !column) return '';
    try {
      const { field } = column;
      if (column.customDataModel) {
        return this.renderCustom(column, item);
      }
      const data = item[field];
      if (data === undefined || data === null) {
        return '-';
      }
      if (typeof data === 'object') {
        return data.title || '-';
      }
      return data || '-';
    } catch (e) {
      return '-';
    }
  }

  getTemplate(col: IColumn): TemplateRef<any> | null {
    const v = col.customDataModel;

    return v instanceof TemplateRef ? (v as TemplateRef<any>) : null;
  }

  renderCustom(column: IColumn, item: any): any {
    const v = column.customDataModel;

    if (!v) {
      return null;
    }
    if (typeof v === 'function') {
      try {
        return (v as (item: any) => any)(item);
      } catch {
        return '-';
      }
    }
    if (typeof v === 'string') return v;
    return null;
  }
}
