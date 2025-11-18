import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ICity, IStateResponse, IZone } from '../models';
import { StatesService } from '../services';

@Component({
  selector: 'app-states-select',
  templateUrl: './states-select.component.html',
  imports: [CommonModule, UikitFieldComponent, Select, ReactiveFormsModule],
})
export class StatesSelectComponent {
  @Input() stateControl!: FormControl;
  @Input() onlyState?: boolean = false;
  @Input() cityControl?: Maybe<FormControl>;
  @Input() zoneControl?: Maybe<FormControl>;

  states = signal<Maybe<IStateResponse[]>>(null);
  getStatesLoading = signal<boolean>(true);
  cities = signal<Maybe<ICity[]>>(null);
  zones = signal<Maybe<IZone[]>>(null);

  isSelectedState = computed(() => this.stateControl.value || this.stateControl.value === 0);

  constructor(private statesService: StatesService) {
    this.getStatesLoading.set(true);

    effect(() => {
      if (this.stateControl) {
        this.stateControl?.valueChanges.subscribe((val) => {
          this.onStateSelect(val);
        });
      }
    });
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.statesService.getRegionTree().subscribe((states) => {
      this.states.set(states);
      this.getStatesLoading.set(false);
      if (this.cityControl?.value && !this.stateControl?.value) {
        const selectedState = states.find((state) =>
          state.children?.some((city) => city.id === this.cityControl?.value),
        );
        if (selectedState) {
          this.cities.set(selectedState.children || []);
          const selectedCity = this.cities()?.find((city) =>
            city.children?.some((zone) => zone.id === this.zoneControl?.value),
          );
          if (selectedCity) {
            this.zones.set(selectedCity.children || []);
          } else {
            this.zones.set(null);
          }
        } else {
          this.cities.set(null);
          this.zones.set(null);
          this.cityControl.setValue(null);
        }
      }
    });
  }

  onStateSelect = (stateId: number) => {
    if (this.cityControl) {
      this.cityControl.setValue(null);
    }

    const cities = this.states()?.find((state) => state.id === stateId)?.children || [];

    this.cities.set(cities);
  };

  onCitySelect = (cityId: number) => {
    if (this.zoneControl) {
      this.zoneControl.setValue(null);
    }

    const zones = this.cities()?.find((city) => city.id === cityId)?.children || [];

    this.zones.set(zones);
  };
}
