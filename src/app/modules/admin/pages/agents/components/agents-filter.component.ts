import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'admin-agents-filter',
  templateUrl: './agents-filter.component.html',
  imports: [
    InputText,
    FormsModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    Button,
    UikitFieldComponent,
    MessageModule,
  ],
})
export class AdminAgentsFilterComponent {
  @Output() onSearch = new EventEmitter<string>();

  search = signal<string>('');
  private debounceTimer: any;

  onFilterChange = (search: string) => {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.onSearch.emit(search);
    }, 300);
  };

  clearSearch = () => {
    clearTimeout(this.debounceTimer);
    this.search.update(() => '');
    this.onSearch.emit('');
  };

  resetFilters = () => {
    this.search.set('');
  };
}
