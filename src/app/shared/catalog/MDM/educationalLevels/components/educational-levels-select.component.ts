import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { EducationalLevelStore } from '../index';

@Component({
  selector: 'catalog-educational-levels-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, UikitFieldComponent],
  templateUrl: './educational-levels-select.component.html',
})
export class EducationalLevelsSelectComponent {
  @Input() control!: FormControl<Maybe<number>>;
  @Input() disabled: boolean = false;

  @Output() onLevelChange = new EventEmitter<Maybe<number>>();

  constructor(private store: EducationalLevelStore) {}

  items = computed(() => this.store.items() || []);
  loading = computed(() => this.store.loading());
}
