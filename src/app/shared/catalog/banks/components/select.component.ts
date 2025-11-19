import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
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

  items = BankList;
}
