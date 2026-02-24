import { PaginatorComponent, UikitCopyComponent, UikitEmptyStateComponent } from '@/uikit';
import {
  formatDurationToText,
  formatJalali,
  formatWithCurrency,
  JALALI_DATE_FORMATS,
} from '@/utils';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  signal,
  TemplateRef,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TableActionRowComponent } from '../table-action-row.component';

export interface IColumn<T = any> {
  field: string;
  header: string;
  width?: string;
  minWidth?: string;
  canCopy?: boolean;
  type?: 'text' | 'price' | 'boolean' | 'date' | 'dateTime' | 'nested' | 'duration' | 'index';
  nestedPath?: string;
  customDataModel?: TemplateRef<any> | ((item: T) => string | number | boolean);
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
    UikitCopyComponent,
  ],
})
export class PageDataListComponent<I> {
  constructor(
    private host: ElementRef,
    private renderer: Renderer2,
  ) {}

  @Input() pageTitle!: string;
  @Input() addNewCtaLabel?: string;
  @Input() columns!: IColumn[];
  @Input() items!: I[];
  @Input() loading!: boolean;
  @Input() emptyPlaceholderTitle: string = 'موردی برای نمایش وجود ندارد';
  @Input() emptyPlaceholderDescription?: string = '';
  @Input() emptyPlaceholderCtaLabel?: string;
  @Input() showEmptyPlaceholderCta?: boolean;
  @Input() totalRecords!: number;
  @Input() perPage?: number = 10;
  @Input() currentPage?: number = 1;
  @Input() showEdit: boolean = false;
  @Input() showDelete: boolean = false;
  @Input() showDetails: boolean = false;
  @Input() showAdd: boolean = false;
  @Input() isFiltered: boolean = false;
  @Input() fullHeight: boolean = false;

  @ContentChild('filter', { static: true }) filter!: TemplateRef<any> | null;
  @ContentChild('caption', { static: true }) caption!: TemplateRef<any> | null;
  @ContentChild('actions', { static: true }) actions!: TemplateRef<any> | null;

  @Output() onEdit = new EventEmitter<I>();
  @Output() onDelete = new EventEmitter<I>();
  @Output() onDetails = new EventEmitter<I>();
  @Output() onAdd = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<any>();

  filterDrawerVisible = signal<boolean>(false);

  ngOnInit() {
    if (this.fullHeight) {
      this.renderer.setStyle(this.host.nativeElement, 'height', '100cqmin');
    }
  }

  edit = (item: I) => {
    this.onEdit.emit(item);
  };

  remove = (item: I) => {
    this.onDelete.emit(item);
  };

  details = (item: I) => {
    this.onDetails.emit(item);
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
      const data = item[String(field)];
      switch (column.type) {
        case 'date':
          if (!data) return '-';
          return formatJalali(data);
        case 'dateTime':
          if (!data) return '-';
          return formatJalali(data, JALALI_DATE_FORMATS.NUMERIC_WITH_TIME);
        case 'boolean':
          return data ? 'بله' : 'خیر';
        case 'price':
          return formatWithCurrency(data, false, 'ریال');
        case 'duration':
          return formatDurationToText(data);
        case 'nested': {
          const path = column.nestedPath;
          if (!path) return '-';
          const nestedData = path
            .split('.')
            .reduce(
              (obj, key) => (obj && obj[key] !== undefined ? obj[key] : null),
              item[String(field)],
            );

          return nestedData || '-';
        }
        default:
          break;
      }

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

  actionsCount = computed(() => {
    let totalCount = 0;
    if (this.showEdit) totalCount += 1;
    if (this.showDelete) totalCount += 1;
    if (this.showDetails) totalCount += 1;
    return totalCount;
  });
}
