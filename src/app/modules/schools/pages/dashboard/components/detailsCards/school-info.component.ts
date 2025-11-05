import { EducationalLevelsTagsComponent, SchoolGendersTag } from '@/shared/catalog';
import { AppCardComponent, CheckVerifiedInfoComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { Badge } from 'primeng/badge';
import { Divider } from 'primeng/divider';
import { SchoolInfoFormComponent } from './school-info-form.component';
import { SchoolDetailsCardsStore } from './store';

@Component({
  selector: 'app-school-info',
  imports: [
    AppCardComponent,
    KeyValueComponent,
    SchoolGendersTag,
    Badge,
    SchoolInfoFormComponent,
    Divider,
    EducationalLevelsTagsComponent,
    CheckVerifiedInfoComponent,
  ],
  templateUrl: './school-info.component.html',
})
export class SchoolInfoComponent {
  private detailsStore = inject(SchoolDetailsCardsStore);

  @Output() onSubmitted = new EventEmitter<void>();

  editMode = signal<boolean>(false);

  info = computed(() => this.detailsStore.school()!);

  canEdit = computed(() => this.detailsStore.canEditInfo());

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  submitForm() {
    this.onSubmitted.emit();
    this.closeForm();
  }
}
