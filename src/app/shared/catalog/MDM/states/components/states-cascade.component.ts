import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, inject, Input, signal } from '@angular/core';
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
  @Input() stateFormControlName!: FormControl<Maybe<number>>;
  @Input() onlyState?: boolean = false;
  @Input() cityFormControlName?: FormControl<Maybe<number>>;

  statesService = inject(StatesService);

  states = signal<any[]>([]);
  getStatesLoading = signal<boolean>(true);
  selectedStateId = signal<Maybe<number>>(null);
  cities = signal<Maybe<any[]>>(null);

  constructor() {
    this.getStatesLoading.set(true);
    this.statesService.getRegionTree().subscribe((states) => {
      this.states.set(states);
      this.getStatesLoading.set(false);
    });
  }

  onStateSelect = (state: any) => {
    this.selectedStateId.set(state.id);
    this.stateFormControlName.setValue(state.id);
    if (this.cityFormControlName) {
      this.cityFormControlName.setValue(null);
    }
    this.cities.set(state.children);
  };

  onCitySelect = (city: any) => {
    this.cityFormControlName?.setValue(city.id);
  };
}
