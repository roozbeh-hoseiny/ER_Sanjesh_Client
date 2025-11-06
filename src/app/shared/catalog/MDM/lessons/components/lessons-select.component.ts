import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ILessonsInRoot, ILessonsResponse } from '../models';
import { LessonsService } from '../services';

@Component({
  selector: 'catalog-lessons-select',
  standalone: true,
  imports: [CommonModule, UikitFieldComponent, SelectModule, ReactiveFormsModule],
  templateUrl: './lessons-select.component.html',
})
export class LessonsSelectComponent implements OnInit {
  @Input() control!: FormControl<Maybe<string | ILessonsInRoot>>;
  @Input() name: string = 'lesson';
  @Input() filters: string[] = [];
  @Output() onSelect = new EventEmitter<Maybe<string | ILessonsInRoot>>();

  constructor(private lessonsService: LessonsService) {}

  items = signal<ILessonsInRoot[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.getAll();
  }

  get filteredItems() {
    console.log(this.items().filter((lesson) => !this.filters.includes(lesson.id.toString())));

    return this.items().filter((lesson) => !this.filters.includes(lesson.id.toString()));
  }

  getAll(): void {
    this.loading.set(true);

    this.lessonsService.getAllInRoot().subscribe({
      next: (items) => {
        this.items.set(items);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  onSelectItem = (items: ILessonsResponse[]) => {
    console.log(items);

    // this.onSelect.emit(item.id);
  };
}
