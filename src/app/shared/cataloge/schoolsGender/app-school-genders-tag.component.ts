import { Component, Input, signal, inject, OnInit } from '@angular/core';
import { ROW_ITEM } from '@/shared/components/pageDataList/page-data-list.component';
import { schoolGenders } from './schoolGenders.const';
import { TagModule } from 'primeng/tag';
import { ISchoolGender } from './schoolsGender';
import { Maybe } from '@/core';

@Component({
  selector: 'app-school-genders-tag',
  templateUrl: './app-school-genders-tag.component.html',
  imports: [TagModule],
})
export class SchoolGendersTag implements OnInit {
  @Input() genderId!: number;

  private readonly genders = schoolGenders;
  gender = signal<Maybe<ISchoolGender>>(null);

  ngOnInit(): void {
    const gender = this.genders.find((g) => g.id === this.genderId);

    if (!gender) {
      this.gender.set(null);
    } else {
      this.gender.set(gender);
    }
  }
}
