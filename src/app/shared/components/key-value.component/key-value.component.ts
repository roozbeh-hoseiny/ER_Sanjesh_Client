import { formatDurationToText, formatJalali, JALALI_DATE_FORMATS } from '@/utils';
import priceMaskUtils from '@/utils/price-mask.utils';
import { CommonModule } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { Badge } from 'primeng/badge';

@Component({
  selector: 'app-key-value',
  standalone: true,
  imports: [CommonModule, Badge],
  templateUrl: './key-value.component.html',
  host: {
    class: 'w-full block',
  },
})
export class KeyValueComponent {
  @Input() label!: string;
  @Input() value?: string | boolean | number;
  @Input() hint?: string;
  @Input() type:
    | 'price'
    | 'active'
    | 'boolean'
    | 'has'
    | 'date'
    | 'dateTime'
    | 'duration'
    | 'simple' = 'simple';
  @Input() trueValueToShow?: string;
  @Input() falseValueToShow?: string;
  @Input() variant?: 'badge' | 'text';

  valueToShow = computed(() => {
    let value = this.value;
    if (this.type !== 'simple') {
      if (this.value) {
        if (this.trueValueToShow) {
          value = this.trueValueToShow;
        } else {
          switch (this.type) {
            case 'date':
              if (typeof this.value === 'boolean') return '-';

              // @ts-ignore
              return formatJalali(this.value);
            case 'dateTime':
              if (typeof this.value === 'boolean') return '-';
              // @ts-ignore

              return formatJalali(this.value, JALALI_DATE_FORMATS.NUMERIC_WITH_TIME);
            case 'duration':
              return formatDurationToText(this.value as string);
            case 'price':
              return priceMaskUtils.formatWithCurrency(this.value as number);
            case 'active':
              value = 'فعال';
              break;
            case 'boolean':
              value = 'بله';
              break;
            case 'has':
              value = 'دارد';
              break;
          }
        }
      } else {
        if (this.falseValueToShow) {
          value = this.falseValueToShow;
        } else {
          switch (this.type) {
            case 'active':
              value = 'غیر فعال';
              break;
            case 'boolean':
              value = 'خیر';
              break;
            case 'has':
              value = 'ندارد';
              break;
          }
        }
      }
    }
    switch (this.type) {
      case 'simple':
        return this.value || '';
    }
    return value;
  });

  valueType = computed(() =>
    this.variant || ['boolean', 'has', 'active'].includes(this.type) ? 'badge' : 'text',
  );
}
