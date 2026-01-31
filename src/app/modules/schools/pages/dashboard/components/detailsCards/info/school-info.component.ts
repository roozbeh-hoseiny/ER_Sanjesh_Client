import { SchoolGendersTag } from '@/shared/catalog';
import { ExamApplicationTypesTagComponent } from '@/shared/catalog/examApplicationTypes/components/tag.component';
import {
  AppCardComponent,
  CheckVerifiedInfoComponent,
  InlineConfirmationComponent,
} from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { Badge } from 'primeng/badge';
import { Divider } from 'primeng/divider';
import { SchoolDetailsCardsStore } from '../store';
import { SchoolInfoCategoriesComponent } from './school-info-categories.component';
import { SchoolInfoFieldsComponent } from './school-info-fields.component';
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
    CheckVerifiedInfoComponent,
    SchoolInfoCategoriesComponent,
    SchoolInfoFieldsComponent,
    ExamApplicationTypesTagComponent,
    InlineConfirmationComponent,
  ],
  templateUrl: './school-info.component.html',
})
export class SchoolInfoComponent {
  private detailsStore = inject(SchoolDetailsCardsStore);

  @Output() onSubmitted = new EventEmitter<void>();

  editMode = signal<boolean>(false);

  info = computed(() => this.detailsStore.school()!);
  showCategories = computed(() => this.detailsStore.showCategories());
  categories = computed(() => this.detailsStore.schoolCategories());

  canEdit = computed(() => this.detailsStore.canEditInfo());
  canEditCategories = computed(() => this.detailsStore.canEditCategories());
  canEditFields = computed(() => this.detailsStore.canEditFields());
  caEditEditable = computed(() => this.detailsStore.caEditEditable());

  showInlineConfirmation = computed(() =>
    this.detailsStore.showManagerValidateInlineConfirmation(),
  );

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  toggleVerifyMobile(status: boolean) {
    const observable = this.detailsStore[
      status ? 'validateManagerMobile' : 'invalidateManagerMobile'
    ](this.info().id);
    if (observable && typeof (observable as any).subscribe === 'function') {
      (observable as { subscribe: Function }).subscribe(() => {
        this.onSubmitted.emit();
      });
    }
  }

  toggleVerifyEmail(status: boolean) {
    const observable = this.detailsStore[
      status ? 'validateManagerEmail' : 'invalidateManagerEmail'
    ](this.info().id);
    if (observable && typeof (observable as any).subscribe === 'function') {
      (observable as { subscribe: Function }).subscribe(() => {
        this.onSubmitted.emit();
      });
    }
  }

  updateCanEdit(status: boolean) {
    this.detailsStore.updateCanEditInfo(this.info().id, status).subscribe(() => {
      this.onSubmitted.emit();
    });
  }

  submitForm() {
    this.onSubmitted.emit();
    this.closeForm();
  }
}
