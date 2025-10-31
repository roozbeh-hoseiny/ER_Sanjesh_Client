import { ISchoolResponse } from '@/modules/schools/models';
import { SchoolGendersTag } from '@/shared/catalog';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, Input, signal } from '@angular/core';
import { Badge } from 'primeng/badge';
import { SchoolInfoFormComponent } from './school-info-form.component';

@Component({
  selector: 'app-school-info',
  imports: [AppCardComponent, KeyValueComponent, SchoolGendersTag, Badge, SchoolInfoFormComponent],
  templateUrl: './school-info.component.html',
})
export class SchoolInfoComponent {
  @Input() info!: ISchoolResponse;

  editMode = signal<boolean>(false);

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }
}
