import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type PSize = 'small' | 'normal' | 'large';

@Component({
  selector: 'uikit-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [attr.for]="for" [ngClass]="computedClass" [attr.class]="className" class="select-none">
      <ng-content></ng-content>
    </label>
  `,
})
export class UikitLabelComponent {
  @Input() for?: string;
  @Input() pSize: PSize = 'normal';
  @Input() className?: string;
  @Input() invalid?: boolean;

  private sizeMap: Record<PSize, string> = {
    small: 'text-sm',
    normal: 'text-md',
    large: 'text-lg',
  };

  get computedClass(): string {
    // default styling used elsewhere in the app for labels
    const base = 'block text-muted-color font-medium';
    const size = this.sizeMap[this.pSize] ?? this.sizeMap.normal;
    const errorClass = this.invalid ? 'text-red-600' : '';
    return `${base} ${size} ${errorClass}`;
  }
}
