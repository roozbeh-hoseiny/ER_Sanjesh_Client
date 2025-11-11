import { Maybe } from '@/core';
import { AdminSchoolsService } from '@/modules/admin/services';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TreeNodeSelectEvent } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { ICategoryFullTreeMapped, ICategoryFullTreeResponse } from '../../models/schools';

function mapCategory(category: any): ICategoryFullTreeMapped {
  return {
    ...category,
    label: category.title,
    key: String(category.id),
    children: Array.isArray(category.children) ? category.children.map(mapCategory) : [],
  };
}

@Component({
  selector: 'app-schools-categories-tree-select',
  templateUrl: './admin-schools-categories-tree-select.component.html',
  imports: [
    UikitFieldComponent,
    TreeSelectModule,
    TableModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
  ],
  host: {
    class: 'w-full',
  },
})
export class SchoolsCategoriesTreeSelectComponent {
  @Input() control!: FormControl<Maybe<ICategoryFullTreeMapped>>;

  private _filters: number[] = [];
  @Input()
  set filters(value: number[]) {
    this.filterCategories(value);
  }
  get filters() {
    return this._filters;
  }

  @Input() showLabel?: boolean = true;
  @Input() placeholder?: string;
  @Input() loading?: boolean;
  @Output() selectionChange = new EventEmitter<ICategoryFullTreeMapped>();
  @Output() selectionClear = new EventEmitter();

  adminSchoolService = inject(AdminSchoolsService);

  allCategories = [] as ICategoryFullTreeResponse[];
  filteredCategories = signal<ICategoryFullTreeMapped[]>([]);
  getCategoriesLoading = signal<boolean>(true);
  selectedCategoryId = signal<Maybe<number>>(null);

  constructor() {
    this.getCategoriesLoading.set(true);
    this.adminSchoolService.getCategories().subscribe((categories) => {
      this.allCategories = categories;
      this.filterCategories(this._filters);
      this.getCategoriesLoading.set(false);
    });
  }

  filterCategories = (filters: number[]) => {
    this._filters = filters || [];

    const allCategories = JSON.parse(
      JSON.stringify(this.allCategories),
    ) as ICategoryFullTreeResponse[];
    this.filteredCategories.set(
      allCategories
        .filter((category) => {
          if (category.children && category.children.length > 0) {
            category.children = category.children.filter(
              (child) => !this._filters.includes(child.id),
            );
          }
          if (category.children && category.children.length > 0) {
            return true;
          }
          return !this._filters.includes(category.id);
        })
        .map((category) => mapCategory(category)),
    );
  };

  onCategorySelect = (category: TreeNodeSelectEvent) => {
    const node = category.node as unknown as ICategoryFullTreeMapped;

    if (!node) {
      this.onClear();
    } else {
      this.selectedCategoryId.set(node.id);
      this.selectionChange.emit(node);
    }
  };
  onClear = () => {
    this.selectedCategoryId.set(null);
    this.selectionClear.emit();
  };
}
