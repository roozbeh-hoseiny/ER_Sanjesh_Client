import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ICity, IStateResponse } from '../models';
import { StatesService } from '../services';

@Component({
  selector: 'app-states-select',
  templateUrl: './states-select.component.html',
  imports: [CommonModule, UikitFieldComponent, Select, ReactiveFormsModule],
})
export class StatesSelectComponent {
  @Input() stateControl!: Maybe<AbstractControl>;
  @Input() onlyState?: boolean = false;
  @Input() cityControl?: Maybe<AbstractControl>;

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
    this.stateControl?.setValue(state.id);
    if (this.cityControl) {
      this.cityControl.setValue(null);
    }
    this.cities.set(state.children);
  };

  onCitySelect = (city: ICity) => {
    this.cityControl?.setValue(city.id);
  };

  get stateFormControl(): FormControl | undefined {
    return this.stateControl as FormControl | undefined;
  }

  get cityFormControl(): FormControl | undefined {
    return this.cityControl as FormControl | undefined;
  }
}
