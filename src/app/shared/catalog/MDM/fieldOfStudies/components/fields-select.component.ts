import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FieldOfStudiesStore } from '../dataStore/store';
import { IFieldOfStudiesResponse } from '../models';

@Component({
  selector: 'catalog-fields-select',
  standalone: true,
  imports: [CommonModule, UikitFieldComponent, SelectModule, ReactiveFormsModule],
  templateUrl: './fields-select.component.html',
  host: { class: 'w-full' },
})
export class FieldsSelectComponent {
  @Input() control!: FormControl<Maybe<IFieldOfStudiesResponse>>;
  @Input() name: string = 'fieldOfStudy';

  private _filters: number[] = [];
  @Input()
  set filters(value: number[]) {
    this.filterOptions(value);
  }
  get filters() {
    return this._filters;
  }

  @Input() showLabel?: boolean = true;
  @Input() placeholder?: string;
  @Input() loading?: boolean;
  @Output() selectionChange = new EventEmitter<IFieldOfStudiesResponse>();
  @Output() selectionClear = new EventEmitter();

  filteredItems = signal<IFieldOfStudiesResponse[]>([]);
  selectedItemId = signal<Maybe<number>>(null);

  constructor(private store: FieldOfStudiesStore) {
    effect(() => {
      if (this.items()?.length) {
        this.filterOptions(this._filters);
      }
    });
  }

  items = computed(() => this.store.items());
  initialLoading = computed(() => this.store.loading());

  filterOptions = (filters: number[]) => {
    this._filters = filters || [];

    const allFields = (JSON.parse(JSON.stringify(this.items())) || []) as IFieldOfStudiesResponse[];
    this.filteredItems.set(allFields.filter((field) => !this._filters.includes(field.id)));
  };

  onSelect = (field: SelectChangeEvent) => {
    const node = field.value as IFieldOfStudiesResponse;

    if (!node) {
      this.onClear();
    } else {
      this.selectionChange.emit(node);
    }
  };
  onClear = () => {
    this.selectionClear.emit();
  };
}
