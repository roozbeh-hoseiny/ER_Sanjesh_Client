import { Maybe } from '@/core';
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
