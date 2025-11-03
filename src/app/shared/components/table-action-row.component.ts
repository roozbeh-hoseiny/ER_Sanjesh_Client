import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
  selector: '[table-action-row]',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './table-action-row.component.html',
})
export class TableActionRowComponent {
  @Input() showEdit = false;
  @Input() showDelete = false;
  @Input() showDetails = false;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() details = new EventEmitter<void>();

  get widthStyle(): string {
    const count = [this.showEdit, this.showDelete, this.showDetails].filter(Boolean).length;
    return `${count * 2.5 + count - 1 * 0.25}rem`;
  }

  widthClass: string = '';
}
