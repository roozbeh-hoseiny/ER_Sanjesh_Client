import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
  selector: 'uikit-empty-state',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './uikit-emptystate.component.html',
})
export class UikitEmptyStateComponent implements AfterContentInit {
  @ContentChild('cta', { static: false, read: ElementRef }) ctaContent?: ElementRef;
  hasCtaContent = false;

  @Input() title: string = 'متاسفانه موردی یافت نشد.';
  @Input() description?: string;
  @Input() icon: string = 'pi pi-database';
  @Input() ctaLabel?: string;
  @Input() showCTA?: boolean = true;

  @Output() ctaClick = new EventEmitter<void>();

  ngAfterContentInit() {
    this.hasCtaContent = !!this.ctaContent;
  }
}
