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
  isSelectedCity = computed(() => this.cityControl?.value || this.cityControl?.value === 0);

  constructor(private statesService: StatesService) {
    this.getStatesLoading.set(true);

    effect(() => {
      if (this.stateControl) {
        this.stateControl?.valueChanges.subscribe((val) => {
          this.onStateSelect(val);
        });
      }
      if (this.cityControl) {
        this.cityControl?.valueChanges.subscribe((val) => {
          this.onCitySelect(val);
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
      const selectedCityId = this.cityControl?.value;
      const selectedZoneId = this.zoneControl?.value;
      // if (selectedZoneId && !this.cityControl?.value) {
      //   const selectedCity = states
      //     .flatMap((state) => state.children || [])
      //     .find((city) => city.children?.some((zone) => zone.id === selectedZoneId));
      //   if (selectedCity) {
      //     const selectedState = states.find((state) =>
      //       state.children?.some((city) => city.id === selectedCity.id),
      //     );
      //     if (selectedState) {
      //       this.cities.set(selectedState.children || []);
      //       // this.zones.set(selectedCity.children || []);
      //       this.stateControl.setValue(selectedState.id);
      //       this.cityControl?.setValue(selectedCity.id);
      //       this.zoneControl?.setValue(selectedZoneId);
      //     }
      //   } else {
      //     this.cities.set(null);
      //     this.zones.set(null);
      //     this.cityControl?.setValue(null);
      //   }
      // } else
      if (selectedCityId && !this.stateControl?.value) {
        const selectedState = states.find((state) =>
          state.children?.some((city) => city.id === selectedCityId),
        );
        if (selectedState) {
          this.cities.set(selectedState.children || []);
          this.stateControl.setValue(selectedState.id);
          this.cityControl?.setValue(selectedCityId);
        } else {
          this.cities.set(null);
          this.cityControl?.setValue(null);
        }

        console.log('selectedZoneId');
        console.log(selectedZoneId);

        this.zoneControl?.setValue(selectedZoneId);
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
    console.log('this.onCitySelect', cityId);

    if (this.zoneControl) {
      this.zoneControl.setValue(0);
    }

    if (cityId === 119) {
      this.zones.set(
        Array.from(
          { length: 22 },
          (_, i) => ({ id: i + 1, title: `منطقه ${i + 1}`, regionType: 4, parentId: 119 }) as IZone,
        ),
      );
      this.zoneControl?.setValue(this.zoneControl);
      return;
    }
  };
}
