import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { BankList, IBank } from '../constants/banks.const';

@Component({
  selector: 'catalog-bank-select',
  standalone: true,
  imports: [CommonModule, UikitFieldComponent, SelectModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
})
export class BankSelectComponent {
  @Input() control!: FormControl<Maybe<number>>;
  @Input() name: string = 'bank';
  @Input() showLabel?: boolean = true;
  @Input() placeholder?: string;
  @Output() selectionChange = new EventEmitter<IBank>();
  @Output() selectionClear = new EventEmitter();

  selectedItemId = signal<Maybe<number>>(null);

  items = BankList;

  onSelect = (field: SelectChangeEvent) => {
    const node = field.value as IBank;

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
