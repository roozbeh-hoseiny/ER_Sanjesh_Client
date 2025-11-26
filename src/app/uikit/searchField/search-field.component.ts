import { Maybe } from '@/core';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Skeleton } from 'primeng/skeleton';
import { debounceTime, filter, Observable } from 'rxjs';
import { UikitFieldComponent } from '../uikit-field.component';

@Component({
  selector: 'uikit-search-field',
  templateUrl: './search-field.component.html',
  imports: [
    UikitFieldComponent,
    InputGroup,
    InputGroupAddon,
    ProgressSpinner,
    Skeleton,
    Message,
    InputTextModule,
    ReactiveFormsModule,
  ],
})
export class UikitSearchFieldComponent<T> {
  @Input() label!: string;
  @Input() placeholder: string = 'جستجو...';
  @Input() debounceTime: number = 300;
  @Input() notFoundMessage: string = 'موردی یافت نشد.';
  @Input() foundedMessage: (item: T) => string = () => 'مورد یافت شد.';
  @Input() search!: (query: string) => Observable<Maybe<T>>;

  @Output() searchResult = new EventEmitter<Maybe<T>>();

  control = new FormControl<string>('');

  constructor() {
    this.control.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        filter((val) => !!val && val.length === 6),
      )
      .subscribe(() => {
        this.searchedLoading.set(true);
        this.search(this.control.value!).subscribe({
          next: (item) => {
            this.searchedItem.set(item);
            this.searchedLoading.set(false);
            this.itemNotFound.set(!item);
            this.searchResult.emit(item);
          },
          error: () => {
            this.searchedLoading.set(false);
            this.itemNotFound.set(true);
            this.searchResult.emit(null);
          },
        });
      });
  }

  submitLoading = signal(false);
  searchedLoading = signal(false);
  searchedItem = signal<Maybe<T>>(null);
  itemNotFound = signal(false);
}
