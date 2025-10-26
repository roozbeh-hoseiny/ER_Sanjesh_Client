import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Message } from 'primeng/message';
import { UikitLabelComponent } from './uikit-label.component';

type PSize = 'small' | 'normal' | 'large';

@Component({
  selector: 'uikit-field',
  standalone: true,
  imports: [CommonModule, UikitLabelComponent, Message],
  templateUrl: './uikit-field.component.html',
})
export class UikitFieldComponent {
  @Input() label!: string;
  @Input() for!: string;
  @Input() pSize: PSize = 'normal';
  @Input() className?: string;
  @Input() invalid?: boolean = false;
}
