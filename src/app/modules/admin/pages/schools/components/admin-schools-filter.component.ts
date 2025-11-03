import { Maybe } from '@/core';
import { StatesCascadeComponent } from '@/shared/catalog';
import { schoolGenders } from '@/shared/catalog/schoolsGender';
import { UikitLabelComponent } from '@/uikit';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SchoolsCategoriesCascadeComponent } from './admin-schools-categories-cascade.component';

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
    SchoolsCategoriesCascadeComponent,
  ],
})
export class AdminSchoolsFilterComponent {
  @Output() onSearch = new EventEmitter<string>();
  @Output() onGenderFilter = new EventEmitter<Maybe<number>>();
  @Output() onCategoryFilter = new EventEmitter<Maybe<number>>();
  @Output() onRegionFilter = new EventEmitter<Maybe<number>>();

  readonly schoolGenders = schoolGenders;

  search = signal<string>('');
  selectedGender = signal<Maybe<number>>(null);
  selectedCategory = signal<Maybe<number>>(null);
  selectedRegion = signal<Maybe<number>>(null);
  private debounceTimer: any;

  onFilterChange = (search: string) => {
    this.selectedCategory.set(null);
    this.selectedGender.set(null);
    this.selectedRegion.set(null);

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

  resetFilters = () => {
    this.search.set('');
    this.selectedGender.set(null);
    this.selectedCategory.set(null);
  };
}
