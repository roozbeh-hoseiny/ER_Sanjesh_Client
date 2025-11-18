import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import {
  ExamApplicationTypeList,
  IExamApplicationType,
} from '../constants/examApplicationTypes.const';

@Component({
  selector: 'catalog-exam-application-types-select',
  standalone: true,
  imports: [CommonModule, UikitFieldComponent, SelectModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
})
export class ExamApplicationTypesSelectComponent {
  @Input() control!: FormControl<Maybe<number>>;
  @Input() name: string = 'examApplicationType';
  @Input() showLabel?: boolean = true;
  @Input() placeholder?: string;
  @Output() selectionChange = new EventEmitter<IExamApplicationType>();
  @Output() selectionClear = new EventEmitter();

  selectedItemId = signal<Maybe<number>>(null);

  items = ExamApplicationTypeList;

  onSelect = (field: SelectChangeEvent) => {
    const node = field.value as IExamApplicationType;

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
