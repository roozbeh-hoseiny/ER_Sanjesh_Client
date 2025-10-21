import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UikitLabelComponent } from './uikit-label.component';

type PSize = 'small' | 'normal' | 'large';

@Component({
  selector: 'uikit-field',
  standalone: true,
  imports: [CommonModule, UikitLabelComponent],
  templateUrl: './uikit-field.component.html',
})
export class UikitFieldComponent {
  @Input() label!: string;
  @Input() for!: string;
  @Input() pSize: PSize = 'normal';
  @Input() className?: string;
}
