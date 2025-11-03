import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-key-value',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-value.component.html',
})
export class KeyValueComponent {
  @Input() label!: string;
  @Input() value?: string = '-';
}
