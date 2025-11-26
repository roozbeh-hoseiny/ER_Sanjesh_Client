import { Maybe } from '@/core';
import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
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

  @ContentChild('header', { static: true }) header?: Maybe<TemplateRef<any>>;
  @ContentChild('moreAction', { static: true }) moreAction?: Maybe<TemplateRef<any>>;

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
