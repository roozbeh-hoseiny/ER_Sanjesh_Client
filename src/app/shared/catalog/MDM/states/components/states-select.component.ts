import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ICity, IStateResponse } from '../models';
import { StatesService } from '../services';

@Component({
  selector: 'app-states-select',
  templateUrl: './states-select.component.html',
  imports: [CommonModule, UikitFieldComponent, SelectModule, FormsModule],
})
export class StatesSelectComponent {
  @Input() stateControl!: Maybe<FormControl>;
  @Input() onlyState?: boolean = false;
  @Input() cityControl?: Maybe<FormControl>;

  statesService = inject(StatesService);

  states = signal<Maybe<IStateResponse[]>>(null);
  getStatesLoading = signal<boolean>(true);
  cities = signal<Maybe<ICity[]>>(null);

  isSelectedState = computed(() => this.stateControl?.value || this.stateControl?.value === 0);

  constructor() {
    this.getStatesLoading.set(true);
    this.statesService.getRegionTree().subscribe((states) => {
      this.states.set(states);
      this.getStatesLoading.set(false);
      if (this.cityControl?.value && !this.stateControl?.value) {
        const selectedState = states.find((state) =>
          state.children.some((city) => city.id === this.cityControl?.value),
        );
        console.log(selectedState);
        if (selectedState) {
          this.stateControl?.setValue(selectedState.id);
          this.cities.set(selectedState.children);
          this.stateControl?.setValue(selectedState.id);
        } else {
          this.cities.set(null);
          this.cityControl.setValue(null);
        }
      }
    });
  }

  onStateSelect = (stateId: any) => {
    if (this.cityControl) {
      this.cityControl.setValue(null);
    }
    this.stateControl?.setValue(stateId.value);
    console.log(stateId);

    const cities = this.states()?.find((state) => state.id === stateId.value)?.children;

    this.cities.set(cities || []);
  };

  onCitySelect = (cityId: any) => {
    if (this.cityControl) {
      this.cityControl.setValue(cityId.value);
    }
  };
}
