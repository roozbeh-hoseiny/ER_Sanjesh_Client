import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  Type,
  Injector,
  inject,
  InjectionToken,
  ViewChild,
  ContentChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SchoolGendersTag } from '@/shared/cataloge/schoolsGender/app-school-genders-tag.component';
import { TableActionRowComponent } from '../table-action-row.component';
import { UikitEmptyStateComponent } from '@/uikit';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';

export interface IColumn {
  field: string;
  header: string;
  width?: string;
  customDataModel?: TemplateRef<any> | ((item: any) => string | number | boolean);
}

export const ROW_ITEM = new InjectionToken<any>('ROW_ITEM');

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
    SchoolGendersTag,
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
  // customDataModels may contain TemplateRef (full template), a function (formatter) or a plain string
  @Input() customDataModels?: Record<string, TemplateRef<any> | ((item: any) => any) | string>;
  // allow passing a component class to render for a specific field
  @Input() componentDataModels?: Record<string, Type<any>>;

  // injector to be used as parent when creating dynamic components
  private parentInjector = inject(Injector);

  // capture projected template from parent components
  @ContentChild('filter', { static: true }) filter!: TemplateRef<any> | null;

  @Output() onEdit = new EventEmitter<I>();
  @Output() onDelete = new EventEmitter<I>();
  @Output() onAdd = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<any>();

  constructor() {}

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

  getCell(item: Record<string, any>, column: IColumn): any {
    if (!item || !column) return '';
    try {
      const { field } = column;
      if (column.customDataModel) return this.renderCustom(column, item);
      const data = item[field];
      if (data === undefined || data === null) {
        return '-';
      }
      if (typeof data === 'object') {
        return data.title || '-';
      }
      return data;
    } catch (e) {
      return '';
    }
  }

  getTemplate(col: IColumn): TemplateRef<any> | null {
    const v = col.customDataModel;

    return v instanceof TemplateRef ? (v as TemplateRef<any>) : null;
  }

  renderCustom(column: IColumn, item: any): any {
    const v = column.customDataModel;

    if (!v) return null;
    if (typeof v === 'function') {
      try {
        return (v as (item: any) => any)(item);
      } catch {
        return '';
      }
    }
    if (typeof v === 'string') return v;
    return null;
  }

  // create an injector that provides the current row item under the token 'rowItem'
  createRowInjector(item: any): Injector {
    return Injector.create({
      providers: [{ provide: ROW_ITEM, useValue: item }],
      parent: this.parentInjector,
    });
  }
}
