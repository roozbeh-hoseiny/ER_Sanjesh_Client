import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { LessonsStore } from '../dataStore/store';
import { ILessonsInRoot } from '../models';

@Component({
  selector: 'catalog-lessons-select',
  standalone: true,
  imports: [CommonModule, UikitFieldComponent, SelectModule, ReactiveFormsModule],
  templateUrl: './lessons-select.component.html',
})
export class LessonsSelectComponent {
  @Input() control: FormControl<Maybe<ILessonsInRoot | number>> = new FormControl<
    Maybe<ILessonsInRoot | number>
  >(null);
  @Input() name: string = 'lesson';
  @Input() onlyId: boolean = false;
  @Input() filters: number[] = [];

  // private _filters: number[] = [];
  // @Input()
  // set filters(value: number[]) {
  //   // this.filterOptions(value);
  // }
  // get filters() {
  //   return this._filters;
  // }

  @Input() showLabel?: boolean = true;
  @Input() placeholder?: string;
  @Input() loading?: boolean;
  @Input() disabled: boolean = false;
  @Output() selectionChange = new EventEmitter<ILessonsInRoot>();
  @Output() selectionClear = new EventEmitter();

  get filteredItems() {
    // this._filters = this.filters || [];

    const allLessons = (JSON.parse(JSON.stringify(this.items())) || []) as ILessonsInRoot[];
    return allLessons.filter((lesson) => !this.filters.includes(lesson.id));
  }
  selectedItemId = signal<Maybe<number>>(null);

  constructor(private store: LessonsStore) {}

  items = computed(() => this.store.mappedItems());
  initialLoading = computed(() => this.store.loading());

  // filterOptions = (filters: number[]) => {
  //   this._filters = filters || [];

  //   const allLessons = JSON.parse(JSON.stringify(this.items())) as ILessonsInRoot[];
  //   this.filteredItems.set(allLessons.filter((lesson) => !this._filters.includes(lesson.id)));
  // };

  onLessonSelect = (lesson: ILessonsInRoot) => {
    if (!lesson) {
      this.onClear();
    } else {
      this.selectionChange.emit(lesson);
    }
  };
  onClear = () => {
    this.selectionClear.emit();
  };
}
