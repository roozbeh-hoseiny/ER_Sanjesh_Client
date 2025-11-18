import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { TableModule } from 'primeng/table';
import { StatesService } from '../services';

@Component({
  selector: 'app-states-cascade',
  templateUrl: './states-cascade.component.html',
  imports: [UikitFieldComponent, CascadeSelectModule, TableModule],
})
export class StatesCascadeComponent {
  @Input() control?: FormControl<Maybe<number>>;

  @Output() selectionChange = new EventEmitter<number>();
  @Output() selectionClear = new EventEmitter();

  statesService = inject(StatesService);

  states = signal<any[]>([]);
  getStatesLoading = signal<boolean>(true);
  selectedRegionId = signal<Maybe<number>>(null);

  constructor() {
    this.getStatesLoading.set(true);
    this.statesService.getRegionTree().subscribe((states) => {
      this.states.set(states);
      this.getStatesLoading.set(false);
    });
  }

  onChange = (region: any) => {
    this.selectedRegionId.set(region?.id);
    this.control?.setValue(region?.id);
    this.selectionChange.emit(region?.id);
  };

  onClear = () => {
    this.selectedRegionId.set(null);
    this.control?.setValue(null);
    this.selectionClear.emit();
  };
}
