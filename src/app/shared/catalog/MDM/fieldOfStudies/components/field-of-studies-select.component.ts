import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IFieldOfStudiesResponse } from '../models';
import { FieldOfStudiesService } from '../services';

@Component({
  selector: 'field-of-studies-select',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, UikitFieldComponent],
  templateUrl: './field-of-studies-select.component.html',
})
export class FieldOfStudiesSelectComponent implements OnInit {
  @Input() formControlName!: FormControl<Maybe<string>>;
  @Input() name: string = 'field';
  @Output() onSelect = new EventEmitter<Maybe<string>>();

  private fieldOfStudiesService = inject(FieldOfStudiesService);

  items = signal<IFieldOfStudiesResponse[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.loading.update(() => true);

    this.fieldOfStudiesService.getAll().subscribe({
      next: (items) => {
        this.items.update(() => items);
      },
      complete: () => {
        this.loading.update(() => false);
      },
    });
  }

  onSelectItem = (item: IFieldOfStudiesResponse) => {
    this.onSelect.emit(item.id);
  };
}
