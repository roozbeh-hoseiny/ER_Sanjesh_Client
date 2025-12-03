import { Maybe } from '@/core';
import { StatesCascadeComponent } from '@/shared/catalog';
import { schoolGenders } from '@/shared/catalog/schoolsGender';
import { UikitLabelComponent } from '@/uikit';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Select } from 'primeng/select';
import { SchoolsCategoriesTreeSelectComponent } from './categories/admin-schools-categories-tree-select.component';

@Component({
  selector: 'app-admin-schools-filter',
  templateUrl: './admin-schools-filter.component.html',
  imports: [
    InputText,
    FormsModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    Button,
    UikitFieldComponent,
    UikitLabelComponent,
    MessageModule,
    StatesCascadeComponent,
    SchoolsCategoriesTreeSelectComponent,
    Select,
    Checkbox,
  ],
})
export class AdminSchoolsFilterComponent {
  @Output() onSearch = new EventEmitter<string>();
  @Output() onGenderFilter = new EventEmitter<Maybe<number>>();
  @Output() onCategoryFilter = new EventEmitter<Maybe<number>>();
  @Output() onRegionFilter = new EventEmitter<Maybe<number>>();
  @Output() onWithoutAgentFilter = new EventEmitter<Maybe<boolean>>();
  @Output() onCanUseCreditFilter = new EventEmitter<Maybe<boolean>>();
  @Output() onCanNotUseCreditFilter = new EventEmitter<Maybe<boolean>>();

  readonly schoolGenders = schoolGenders;

  search = signal<string>('');
  selectedGender = signal<Maybe<number>>(null);
  selectedCategory = signal<Maybe<number>>(null);
  selectedRegion = signal<Maybe<number>>(null);
  selectedWithoutAgent = signal<Maybe<boolean>>(null);
  selectedCanUseCredit = signal<Maybe<boolean>>(null);
  selectedCanNotUseCredit = signal<Maybe<boolean>>(null);

  private debounceTimer: any;

  onFilterChange = (search: string) => {
    this.selectedCategory.set(null);
    this.selectedGender.set(null);
    this.selectedRegion.set(null);
    this.selectedWithoutAgent.set(null);
    this.selectedCanUseCredit.set(null);
    this.selectedCanNotUseCredit.set(null);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.onSearch.emit(search);
    }, 300);
  };

  clearSearch = () => {
    clearTimeout(this.debounceTimer);
    this.search.update(() => '');
    this.onSearch.emit('');
  };

  onGenderChange(genderId: Maybe<number> = null) {
    this.resetFilters();
    this.selectedGender.set(genderId);
    this.onGenderFilter.emit(genderId);
  }

  onCategoryChange(categoryId: Maybe<number> = null) {
    this.resetFilters();
    this.selectedCategory.set(categoryId);
    this.onCategoryFilter.emit(categoryId);
  }

  onRegionChange(regionId: Maybe<number> = null) {
    this.resetFilters();
    this.selectedRegion.set(regionId);
    this.onRegionFilter.emit(regionId);
  }

  onWithoutAgentChange(withoutAgent: Maybe<boolean> = null) {
    this.resetFilters();
    this.selectedWithoutAgent.set(withoutAgent || null);
    this.onWithoutAgentFilter.emit(withoutAgent || null);
  }

  onUseCreditValueChange(value: Maybe<boolean> = null) {
    if (value === null) {
      this.onCanNotUseCreditChange(null);
    }
    if (value === true) {
      this.onCanUseCreditChange(true);
    } else {
      this.onCanNotUseCreditChange(false);
    }
  }

  onCanUseCreditChange(canUseCredit: Maybe<boolean> = null) {
    this.resetFilters();
    this.selectedCanUseCredit.set(canUseCredit);
    this.onCanUseCreditFilter.emit(canUseCredit);
  }

  onCanNotUseCreditChange(canNotUseCredit: Maybe<boolean> = null) {
    this.resetFilters();
    this.selectedCanNotUseCredit.set(canNotUseCredit);
    this.onCanNotUseCreditFilter.emit(canNotUseCredit);
  }

  resetFilters = () => {
    this.search.set('');
    this.selectedGender.set(null);
    this.selectedCategory.set(null);
    this.selectedRegion.set(null);
    this.selectedWithoutAgent.set(null);
    this.selectedCanUseCredit.set(null);
    this.selectedCanNotUseCredit.set(null);
  };
}
