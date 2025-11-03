import { Maybe } from '@/core';
import { Component, Input, computed } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { schoolGenders } from './schoolGenders.const';
import { ISchoolGender } from './schoolsGender';

@Component({
  selector: 'app-school-genders-tag',
  templateUrl: './app-school-genders-tag.component.html',
  imports: [TagModule],
})
export class SchoolGendersTag {
  @Input() genderId!: number;

  private readonly genders = schoolGenders;

  readonly gender = computed(() => {
    const gender = this.genders.find((g) => g.id === this.genderId);

    return gender as Maybe<ISchoolGender>;
  });
}
