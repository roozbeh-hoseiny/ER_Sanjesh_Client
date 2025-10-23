import { Maybe } from '@/core';
import { Component, inject, Input, signal } from '@angular/core';
import { ICity, IStateResponse } from '../models';
import { FormControl } from '@angular/forms';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Select } from 'primeng/select';
import { StatesService } from '../services';

@Component({
  selector: 'app-states-select',
  templateUrl: './states-select.component.html',
  imports: [UikitFieldComponent, Select],
})
export class StatesSelectComponent {
  @Input() stateFormControlName!: FormControl<Maybe<number>>;
  @Input() onlyState?: boolean = false;
  @Input() cityFormControlName?: FormControl<Maybe<number>>;

  statesService = inject(StatesService);

  states = signal<Maybe<IStateResponse[]>>(null);
  getStatesLoading = signal<boolean>(true);
  selectedStateId = signal<Maybe<number>>(null);
  cities = signal<Maybe<ICity[]>>(null);

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

  onCitySelect = (city: ICity) => {
    this.cityFormControlName?.setValue(city.id);
  };
}
