import { SchoolsStore } from '@/modules/schools/dataStore';
import { ISchoolResponse } from '@/modules/schools/models';
import { EducationalLevelsTagsComponent, SchoolGendersTag } from '@/shared/catalog';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, Input, signal } from '@angular/core';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { SchoolInfoFormComponent } from './school-info-form.component';

@Component({
  selector: 'app-school-info',
  imports: [
    AppCardComponent,
    KeyValueComponent,
    SchoolGendersTag,
    Badge,
    SchoolInfoFormComponent,
    Divider,
    Button,
    EducationalLevelsTagsComponent,
  ],
  templateUrl: './school-info.component.html',
})
export class SchoolInfoComponent {
  @Input() info!: ISchoolResponse;

  constructor(private schoolsStore: SchoolsStore) {}

  editMode = signal<boolean>(false);

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  submitForm() {
    this.schoolsStore.getInfo();
    this.closeForm();
  }
}
