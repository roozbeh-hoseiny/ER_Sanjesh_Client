import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ILessonsInRoot } from '../models';
import { LessonsService } from '../services';

@Component({
  selector: 'catalog-lessons-select',
  standalone: true,
  imports: [CommonModule, UikitFieldComponent, SelectModule, ReactiveFormsModule],
  templateUrl: './lessons-select.component.html',
})
export class LessonsSelectComponent implements OnInit {
  @Input() control: FormControl<Maybe<ILessonsInRoot>> = new FormControl<Maybe<ILessonsInRoot>>(
    null,
  );
  @Input() name: string = 'lesson';
  @Input() onlyId: boolean = false;

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
  @Input() disabled: boolean = false;
  @Output() selectionChange = new EventEmitter<ILessonsInRoot>();
  @Output() selectionClear = new EventEmitter();

  filteredItems = signal<ILessonsInRoot[]>([]);
  selectedItemId = signal<Maybe<number>>(null);

  constructor(private lessonsService: LessonsService) {}

  allLessons = signal<ILessonsInRoot[]>([]);
  initialLoading = signal<boolean>(false);

  ngOnInit(): void {
    if (!this.allLessons().length) {
      this.getAll();
    }
  }

  filterOptions = (filters: number[]) => {
    this._filters = filters || [];

    const allLessons = JSON.parse(JSON.stringify(this.allLessons())) as ILessonsInRoot[];
    this.filteredItems.set(allLessons.filter((lesson) => !this._filters.includes(lesson.id)));
  };

  getAll(): void {
    this.initialLoading.set(true);

    this.lessonsService.getAllInRoot().subscribe({
      next: (items) => {
        this.allLessons.set(items);
        this.filterOptions(this.filters);
      },
      complete: () => {
        this.initialLoading.set(false);
      },
    });
  }

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
