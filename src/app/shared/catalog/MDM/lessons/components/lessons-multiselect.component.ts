import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ILessonsResponse } from '../models';
import { LessonsService } from '../services';

@Component({
  selector: 'catalog-lessons-multiselect',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectModule, UikitFieldComponent],
  templateUrl: './lessons-multiselect.component.html',
})
export class LessonsMultiselectComponent implements OnInit {
  @Input() control!: FormControl<Maybe<string>>;
  @Input() name: string = 'lesson';
  @Output() onSelect = new EventEmitter<Maybe<string>>();

  private lessonsService = inject(LessonsService);

  items = signal<ILessonsResponse[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.loading.set(true);

    this.lessonsService.getAll().subscribe({
      next: (items) => {
        this.items.set(items);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  onSelectItem = (item: ILessonsResponse) => {
    this.onSelect.emit(item.id.toString());
  };
}
