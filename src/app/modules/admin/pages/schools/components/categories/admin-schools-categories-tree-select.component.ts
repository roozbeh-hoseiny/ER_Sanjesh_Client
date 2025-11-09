import { Maybe } from '@/core';
import { AdminSchoolsService } from '@/modules/admin/services';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TreeNodeSelectEvent } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { map } from 'rxjs';
import { ICategoryFullTreeMapped } from '../../models/schools';

@Component({
  selector: 'app-schools-categories-tree-select',
  templateUrl: './admin-schools-categories-tree-select.component.html',
  imports: [UikitFieldComponent, TreeSelectModule, TableModule],
})
export class SchoolsCategoriesTreeSelectComponent {
  @Input() formControlName?: FormControl<Maybe<number>>;
  @Output() selectionChange = new EventEmitter<number>();
  @Output() selectionClear = new EventEmitter();

  adminSchoolService = inject(AdminSchoolsService);

  categories = signal<ICategoryFullTreeMapped[]>([]);
  getCategoriesLoading = signal<boolean>(true);
  selectedCategoryId = signal<Maybe<number>>(null);

  constructor() {
    this.getCategoriesLoading.set(true);
    this.adminSchoolService
      .getCategories()
      .pipe(map((categories) => categories.map(mapCategory)))
      .subscribe((categories) => {
        this.categories.set(categories);
        this.getCategoriesLoading.set(false);
      });

    function mapCategory(category: any): ICategoryFullTreeMapped {
      return {
        ...category,
        label: category.title,
        key: String(category.id),
        children: Array.isArray(category.children) ? category.children.map(mapCategory) : [],
      };
    }
  }

  onCategorySelect = (category: TreeNodeSelectEvent) => {
    const node = category.node as unknown as ICategoryFullTreeMapped;

    if (!node) {
      this.onClear();
    } else {
      this.selectedCategoryId.set(node.id);
      this.formControlName?.setValue(node.id);
      this.selectionChange.emit(node.id);
    }
  };
  onClear = () => {
    this.selectedCategoryId.set(null);
    this.formControlName?.setValue(null);
    this.selectionClear.emit();
  };
}
