import { Component, EventEmitter, Output, signal } from '@angular/core';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Button } from 'primeng/button';
import { schoolGenders } from '@/shared/cataloge/schoolsGender';
import { Maybe } from '@/core';

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
  ],
})
export class AdminSchoolsFilterComponent {
  @Output() onSearch = new EventEmitter<string>();
  @Output() onGenderFilter = new EventEmitter<number>();

  readonly schoolGenders = schoolGenders;

  search = signal<string>('');
  selectedGender = signal<Maybe<number>>(null);
  private debounceTimer: any;

  onFilterChange = (search: string) => {
    this.selectedGender.set(null);

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
  onGenderChange(genderId: number) {
    this.search.set('');
    this.selectedGender.set(genderId);
    this.onGenderFilter.emit(genderId);
  }
}
