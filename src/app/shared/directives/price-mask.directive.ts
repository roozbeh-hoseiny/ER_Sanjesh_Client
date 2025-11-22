import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPriceMask]',
  standalone: true,
})
export class PriceMaskDirective implements OnInit {
  @Input('appPriceMaskLocale') locale: string = 'fa-IR';
  @Input('appPriceMaskFraction') fraction = 0;
  /**
   * When true, force comma (",") as thousands separator by using `en-US` formatting.
   * If false, uses the provided `appPriceMaskLocale`.
   */
  @Input('appPriceMaskUseComma') useComma = false;

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
  }

  private toArabicDigitsAwareNumber(str: string): string {
    if (!str) return '';
    // Map Arabic-Indic and Extended Arabic-Indic digits to ASCII digits
    const map: Record<string, string> = {
      '٠': '0',
      '١': '1',
      '٢': '2',
      '٣': '3',
      '٤': '4',
      '٥': '5',
      '٦': '6',
      '٧': '7',
      '٨': '8',
      '٩': '9',
      '۰': '0',
      '۱': '1',
      '۲': '2',
      '۳': '3',
      '۴': '4',
      '۵': '5',
      '۶': '6',
      '۷': '7',
      '۸': '8',
      '۹': '9',
    };
    return str.replace(/[٠-٩۰-۹]/g, (d) => map[d] ?? d);
  }

  private cleanNumericString(raw: string): string {
    // Convert localized digits to ASCII, then remove everything except digits, dot and minus
    const ascii = this.toArabicDigitsAwareNumber(raw);
    return ascii.replace(/[^0-9.\-]/g, '');
  }

  private formatNumber(value: number): string {
    try {
      const fmtLocale = this.useComma ? 'en-US' : this.locale;
      return new Intl.NumberFormat(fmtLocale, {
        maximumFractionDigits: this.fraction,
        minimumFractionDigits: 0,
        useGrouping: true,
      }).format(value);
    } catch (e) {
      return String(value);
    }
  }

  @HostListener('input', ['$event'])
  onInput(ev: Event) {
    if (!this.inputEl) return;
    const raw = (ev.target as HTMLInputElement).value || this.inputEl.value || '';
    const cleaned = this.cleanNumericString(raw);
    if (cleaned === '') {
      // clear control
      if (this.ngControl?.control) this.ngControl.control.setValue(null);
      return;
    }
    const asNumber = Number(cleaned);
    if (isNaN(asNumber)) return;

    const formatted = this.formatNumber(asNumber);

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
}
