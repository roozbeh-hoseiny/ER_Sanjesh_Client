import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-card-data',
  standalone: true,
  templateUrl: './card-data.component.html',
  imports: [Card, CommonModule, ButtonDirective],
})
export class AppCardComponent {
  @Input() cardTitle!: string;
  @Input() editable: boolean = false;
  @Input() editMode: boolean = false;

  @Output() onEdit = new EventEmitter<void>();

  constructor() {
    if (this.editable) {
      if (!this.onEdit) {
        throw new Error('onEdit output must be bound when editable is true');
      }
    }
  }

  onEditClick() {
    this.onEdit.emit();
  }
}
