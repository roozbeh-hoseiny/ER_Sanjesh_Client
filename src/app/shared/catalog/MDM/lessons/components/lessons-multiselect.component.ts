import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { LessonsStore } from '../dataStore/store';
import { ILessonsResponse } from '../models';

@Component({
  selector: 'catalog-lessons-multiselect',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectModule, UikitFieldComponent],
  templateUrl: './lessons-multiselect.component.html',
})
export class LessonsMultiselectComponent {
  @Input() control!: FormControl<Maybe<string>>;
  @Input() name: string = 'lesson';
  @Output() onSelect = new EventEmitter<Maybe<string>>();

  constructor(private store: LessonsStore) {}

  items = computed(() => this.store.items() || []);
  loading = computed(() => this.store.loading());

  onSelectItem = (item: ILessonsResponse) => {
    this.onSelect.emit(item.id.toString());
  };
}
