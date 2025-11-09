import { Maybe } from '@/core';
import { AdminSchoolsService } from '@/modules/admin/services';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-schools-categories-cascade',
  templateUrl: './admin-schools-categories-cascade.component.html',
  imports: [UikitFieldComponent, CascadeSelectModule, TableModule],
})
export class SchoolsCategoriesCascadeComponent {
  @Input() formControlName?: FormControl<Maybe<number>>;
  @Output() selectionChange = new EventEmitter<number>();
  @Output() selectionClear = new EventEmitter();

  adminSchoolService = inject(AdminSchoolsService);

  categories = signal<any[]>([]);
  getCategoriesLoading = signal<boolean>(true);
  selectedCategoryId = signal<Maybe<number>>(null);

  constructor() {
    this.getCategoriesLoading.set(true);
    this.adminSchoolService.getCategories().subscribe((categories) => {
      this.categories.set(categories);
      this.getCategoriesLoading.set(false);
    });
  }

  onCategorySelect = (category: any) => {
    if (!category) {
      this.onClear();
    } else {
      this.selectedCategoryId.set(category.id);
      this.formControlName?.setValue(category.id);
      this.selectionChange.emit(category.id);
    }
  };
  onClear = () => {
    this.selectedCategoryId.set(null);
    this.formControlName?.setValue(null);
    this.selectionClear.emit();
  };
}
