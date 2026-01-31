import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Renderer2,
  Self,
  SimpleChanges,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  cleanNumericString,
  formatNumber,
  formatWithCurrency,
  normalizeToNumber,
} from '../../utils/price-mask.utils';

@Directive({
  selector: '[appPriceMask]',
  standalone: true,
})
export class PriceMaskDirective implements OnInit, OnChanges {
  /** Optional value to render/format when bound like [appPriceMask]="price" */
  @Input('appPriceMask') priceValue: number | string | null | undefined;
  @Input('appPriceMaskLocale') locale: string = 'fa-IR';
  @Input('appPriceMaskFraction') fraction = 0;
  /**
   * When true, force comma (",") as thousands separator by using `en-US` formatting.
   * If false, uses the provided `appPriceMaskLocale`.
   */
  @Input('appPriceMaskUseComma') useComma = false;
  /** Optional currency code to append for non-input hosts (e.g., "ریال" | "تومان") */
  @Input('appPriceMaskCurrency') currency: string | null = 'ریال';

  private inputEl!: HTMLInputElement | null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() @Self() private ngControl: NgControl | null,
  ) {}

  ngOnInit(): void {
    // p-inputNumber renders an input inside its host element; try to locate it
    const host: HTMLElement = this.el.nativeElement;
    this.inputEl =
      host.tagName.toLowerCase() === 'input'
        ? (host as HTMLInputElement)
        : host.querySelector('input');

    // If a value is bound initially (e.g., span with [appPriceMask]), render it
    if (this.priceValue !== undefined) {
      this.renderFromBoundValue();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priceValue'] && this.priceValue !== undefined) {
      this.renderFromBoundValue();
    }
  }

  // Numeric parsing/formatting helpers moved to utils/price-mask.utils.ts

  @HostListener('input', ['$event'])
  onInput(ev: Event) {
    if (!this.inputEl) return;
    const raw = (ev.target as HTMLInputElement).value || this.inputEl.value || '';
    const cleaned = cleanNumericString(raw);
    if (cleaned === '') {
      // clear control
      if (this.ngControl?.control) this.ngControl.control.setValue(null);
      return;
    }
    const asNumber = Number(cleaned);
    if (isNaN(asNumber)) return;

    const formatted = formatNumber(asNumber, {
      locale: this.locale,
      useComma: this.useComma,
      fraction: this.fraction,
    });

    // preserve caret position roughly: compute delta and adjust
    const prevPos = this.inputEl.selectionStart ?? raw.length;
    const prevLen = raw.length;

    // Update FormControl value with numeric value first (suppress events)
    if (this.ngControl?.control) {
      try {
        this.ngControl.control.setValue(asNumber, { emitEvent: false });
      } catch (err) {
        // fallback: ignore
      }
    }

    // Update the displayed value (override any writeValue from control)
    this.renderer.setProperty(this.inputEl, 'value', formatted);

    try {
      const newLen = formatted.length;
      let newPos = prevPos + (newLen - prevLen);
      if (newPos < 0) newPos = 0;
      if (newPos > newLen) newPos = newLen;
      this.inputEl.setSelectionRange(newPos, newPos);
    } catch (err) {
      // ignore selection errors
    }
  }

  /** Render when bound via [appPriceMask] on non-input hosts (e.g., span) or to set initial value. */
  private renderFromBoundValue() {
    const num = normalizeToNumber(this.priceValue);

    // If host has an input element, set both control value (if any) and displayed value
    if (this.inputEl) {
      if (this.ngControl?.control) {
        try {
          this.ngControl.control.setValue(num, { emitEvent: false });
        } catch (err) {
          // ignore
        }
      }

      const formatted = formatWithCurrency(num, true, this.currency, {
        locale: this.locale,
        useComma: this.useComma,
        fraction: this.fraction,
      });
      this.renderer.setProperty(this.inputEl, 'value', formatted);
      return;
    }

    // Otherwise, render to host text (e.g., span/div)
    const formatted = formatWithCurrency(num, false, this.currency, {
      locale: this.locale,
      useComma: this.useComma,
      fraction: this.fraction,
    });
    this.renderer.setProperty(this.el.nativeElement, 'textContent', formatted);
  }
}
