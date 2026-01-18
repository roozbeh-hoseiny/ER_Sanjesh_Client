import { Maybe } from '@/core';
import { Component, EventEmitter, Input, model, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export interface ISelectItem {
  id: number;
  name: string;
}

@Component({
  selector: 'abstract-select-field',
  template: '',
})
export abstract class AbstractSelectComponent<T = ISelectItem, serviceResponse = T[]> {
  @Input() control = new FormControl<Maybe<number | T>>(null);
  @Input() canInsert: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() showErrors: boolean = true;
  @Input() showClear: boolean = true;
  @Input() isFullDataOptionValue: boolean = false;
  @Input() optionValue = 'id';
  @Output() onChange = new EventEmitter<Maybe<T>>();
  @Output() onSetDefaultDataItem = new EventEmitter<T>();

  loading = signal(false);
  items = signal<Maybe<T[]>>(null);
  isOpenFormDialog = signal(false);
  value = model<Maybe<T>>(null);

  constructor() {
    if (this.value()) {
      this.control.setValue(this.value());
    }

    this.control.valueChanges.subscribe((val) => {
      this.value.set(val as Maybe<T>);
    });
  }

  abstract getDataService(): Observable<serviceResponse>;
  getData() {
    this.loading.set(true);
    this.getDataService().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.items.set(res);
          // @ts-ignore
        } else if ('data' in res) {
          // @ts-ignore
          this.items.set(res.data);
        }

        const defaultValue = this.control.value;
        if (defaultValue) {
          const selectedItem = this.items()?.find(
            (item) => (item as Record<string, any>)[this.optionValue] == defaultValue,
          ) as T;

          if (selectedItem) {
            this.onSetDefaultDataItem.emit(selectedItem);
          }
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  setDefaultDataItem(item: T) {
    this.onSetDefaultDataItem.emit(item);
  }

  refresh() {
    this.getData();
  }

  onOpenForm() {
    this.isOpenFormDialog.set(true);
  }

  get selectOptionValue() {
    if (this.isFullDataOptionValue) {
      return undefined;
    }
    return this.optionValue;
  }

  change(value: Maybe<T>) {
    if (typeof value !== 'object') {
      // @ts-ignore
      this.onChange.emit(this.items()?.find((item) => item[this.optionValue] === value));
    } else {
      this.onChange.emit(value);
    }
  }
}
