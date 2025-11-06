import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { debounceTime } from 'rxjs';
import { SchoolsStore } from '../store/schools.store';

@Component({
  selector: 'app-admin-school-select',
  templateUrl: './admin-school-select.component.html',
  imports: [Select, UikitFieldComponent, InputText, ReactiveFormsModule],
})
export class AdminSchoolSelectComponent {
  @Input() control!: FormControl;
  @Input() optionValue: string | undefined = undefined;

  constructor(private store: SchoolsStore) {
    this.store.initial();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.filterItems(value || '');
    });
  }

  searchControl = new FormControl<string>('');

  get loading() {
    return this.store.loading();
  }
  get schools() {
    return this.store.activePageItems();
  }

  selectedSchools = signal<any>([]);

  filterItems = (value: string) => {
    this.store.onSearch(value);
  };
}
