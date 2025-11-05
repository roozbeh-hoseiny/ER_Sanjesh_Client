import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ILessonsResponse } from '../models';
import { LessonsService } from '../services';

@Component({
  selector: 'lessons-select',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, UikitFieldComponent],
  templateUrl: './lessons-select.component.html',
})
export class LessonsSelectComponent implements OnInit {
  @Input() formControlName!: FormControl<Maybe<string>>;
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
    this.onSelect.emit(item.id);
  };
}
