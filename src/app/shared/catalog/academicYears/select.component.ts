import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'catalog-academic-years-select',
  standalone: true,
  imports: [CommonModule, UikitFieldComponent, SelectModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
})
export class AcademicYearsSelectComponent {
  @Input() control!: FormControl<Maybe<number>>;
  @Input() name: string = 'academicYear';
  @Input() showLabel?: boolean = true;
  @Input() placeholder?: string;
  @Output() selectionChange = new EventEmitter<number>();
  @Output() selectionClear = new EventEmitter();

  //TODO: add dayjs and get current year dynamically
  currentYear = 1404;

  items = Array.from({ length: 1 }, (_, i) => ({
    value: this.currentYear - i,
    label: `${this.currentYear - i}-${this.currentYear - i + 1}`,
  }));
}
