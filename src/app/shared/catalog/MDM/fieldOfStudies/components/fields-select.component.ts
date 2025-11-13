import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { IFieldOfStudiesResponse } from '../models';
import { FieldOfStudiesService } from '../services';

@Component({
  selector: 'catalog-fields-select',
  standalone: true,
  imports: [CommonModule, UikitFieldComponent, SelectModule, ReactiveFormsModule],
  templateUrl: './fields-select.component.html',
})
export class FieldsSelectComponent implements OnInit {
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

  constructor(private fieldsService: FieldOfStudiesService) {}

  allFields = signal<IFieldOfStudiesResponse[]>([]);
  initialLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.getAll();
  }

  filterOptions = (filters: number[]) => {
    this._filters = filters || [];

    const allFields = JSON.parse(JSON.stringify(this.allFields())) as IFieldOfStudiesResponse[];
    this.filteredItems.set(allFields.filter((field) => !this._filters.includes(field.id)));

    console.log(this.filteredItems());
  };

  getAll(): void {
    this.initialLoading.set(true);

    this.fieldsService.getAll().subscribe({
      next: (items) => {
        this.allFields.set(items);
        this.filterOptions(this.filters);
      },
      complete: () => {
        this.initialLoading.set(false);
      },
    });
  }

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
